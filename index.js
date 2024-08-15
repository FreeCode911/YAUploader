const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

// Define the scopes
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';
const VIDEO_DIR = 'videos';
const UPLOADED_VIDEOS_FILE = 'uploaded_videos.txt';
const UPLOAD_COUNT_FILE = 'upload_count.txt';
const ALLOWED_EXTENSIONS = ['.mp4'];

// Authenticate and create a YouTube API client
async function getAuthenticatedService() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id } = credentials.installed;
    const redirect_uris = credentials.installed.redirect_uris || ['urn:ietf:wg:oauth:2.0:oob'];
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        oAuth2Client.setCredentials(token);

        // Check if the token is expired or revoked
        try {
            await oAuth2Client.getAccessToken();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
                console.log('Token has expired or been revoked. Please reauthorize the application.');
                await getAccessToken(oAuth2Client); // Trigger reauthorization
            } else {
                throw error;
            }
        }
    } else {
        await getAccessToken(oAuth2Client);
    }

    return google.youtube({ version: 'v3', auth: oAuth2Client });
}

async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    console.error('Error retrieving access token', err);
                    return reject(err);
                }
                oAuth2Client.setCredentials(token);
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
                resolve();
            });
        });
    });
}

// Upload video to YouTube
async function uploadVideo(youtube, videoFile, title, description, category, tags) {
    const filePath = path.join(VIDEO_DIR, videoFile);
    const fileSize = fs.statSync(filePath).size;

    try {
        const res = await youtube.videos.insert(
            {
                part: 'snippet,status',
                requestBody: {
                    snippet: {
                        title: title,
                        description: description,
                        tags: tags,
                        categoryId: category,
                    },
                    status: {
                        privacyStatus: 'public',
                    },
                },
                media: {
                    body: fs.createReadStream(filePath),
                },
            },
            {
                onUploadProgress: (evt) => {
                    const progress = (evt.bytesRead / fileSize) * 100;
                    if ([1, 50, 100].includes(Math.round(progress))) {
                        console.log(`${Math.round(progress)}% complete`);
                    }
                },
            }
        );
        return res.data;
    } catch (error) {
        throw new Error(`Error uploading video: ${error.message}`);
    }
}

// Load uploaded videos
function loadUploadedVideos() {
    if (!fs.existsSync(UPLOADED_VIDEOS_FILE)) return [];
    return fs.readFileSync(UPLOADED_VIDEOS_FILE, 'utf8').split('\n').filter(Boolean);
}

// Save uploaded video
function saveUploadedVideo(videoFile) {
    fs.appendFileSync(UPLOADED_VIDEOS_FILE, `${videoFile}\n`);
}

// Load upload count
function loadUploadCount() {
    if (!fs.existsSync(UPLOAD_COUNT_FILE)) return 0;
    return parseInt(fs.readFileSync(UPLOAD_COUNT_FILE, 'utf8').trim(), 10);
}

// Save upload count
function saveUploadCount(count) {
    fs.writeFileSync(UPLOAD_COUNT_FILE, count.toString());
}

// Function to introduce delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Compare function to sort files numerically
function numericSort(a, b) {
    return parseInt(a, 10) - parseInt(b, 10);
}

// Main function to upload videos
async function main() {
    const youtube = await getAuthenticatedService();

    while (true) {
        const uploadedVideos = loadUploadedVideos();
        let videoFiles = fs.readdirSync(VIDEO_DIR)
            .filter(f => f.endsWith('.mp4') && !uploadedVideos.includes(f))
            .sort(numericSort);
        let uploadCount = loadUploadCount();

        if (videoFiles.length > 0) {
            for (let i = 0; i < 4 && videoFiles.length > 0; i++) { // Upload three videos
                const videoFile = videoFiles.shift();
                uploadCount += 1;
                const title = `Daily Facts #${uploadCount} #facts #tech #smartphone`;
                const description = `Daily Facts #${uploadCount} #facts #tech #smartphone`;
                const category = '22'; // Education
                const tags = ['OnlineClasses', 'OnlineLearning', 'LearningTips', 'LearningHacks', 'DailyFacts'];

                console.log(`Uploading video: ${videoFile} with title: ${title}`);

                try {
                    const response = await uploadVideo(youtube, videoFile, title, description, category, tags);
                    console.log(`Successfully uploaded ${videoFile}`);
                    saveUploadedVideo(videoFile);
                    saveUploadCount(uploadCount);
                } catch (e) {
                    console.error(`Failed to upload ${videoFile}. Error: ${e.message}`);
                    uploadCount -= 1; // Revert count increment if upload fails
                    videoFiles.unshift(videoFile); // Re-add the video file to the beginning of the list
                    break; // Exit the loop to avoid uploading the next video
                }

                if (i < 3) { // Wait 4 hours before uploading the next video in the same day
                    console.log(`Waiting for 4 hours before uploading the next video...`);
                    await delay(4 * 60 * 60 * 1000); // Wait for 4 hours
                }
            }

            console.log(`Waiting for 24 hours before the next upload batch...`);
            await delay(24 * 60 * 60 * 1000); // Wait for 24 hours before uploading the next batch
        } else {
            console.log(`No more videos to upload. Checking again in 1 hour...`);
            await delay(60 * 60 * 1000); // Wait for 1 hour before checking again
        }
    }
}

main().catch(console.error);
