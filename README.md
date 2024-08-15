# YAUploader

This YAUpload is a YouTube auto uploader that allows you to automatically upload videos to your YouTube channel at scheduled intervals. 

## Features

* **Automatic Video Upload:**  Uploads videos from a specified directory to your YouTube channel.
* **Scheduled Uploads:** Configures upload schedules to upload videos at specific times. 
* **Title, Description, and Tags:** Allows you to customize the title, description, and tags for each video.
* **Category Selection:** Choose the appropriate category for your videos.
* **Upload Progress Tracking:**  Tracks the upload progress and provides updates in the console.
* **Error Handling:**  Handles upload errors gracefully and provides information about the issue.

## Getting Started

1. **Set up Google Cloud Platform (GCP) Project:**
    * Create a new GCP project and enable the YouTube Data API.
    * Go to [https://console.cloud.google.com/apis/library/youtube.googleapis.com](https://console.cloud.google.com/apis/library/youtube.googleapis.com) and enable the YouTube Data API.
    * Create an API Key for the project.
    * Download your credentials file from the Google Cloud Console.

2. **Configure the YAUploader:**
    * **Replace the placeholder values in `credentials.json` with your GCP API credentials.**
    * **Create a `videos` directory in the Repl to store your video files.**
    * **Set the `VIDEO_DIR` variable in `index.js` to the path of your video directory.**
    * **Customize the `title`, `description`, `category`, and `tags` variables in `Config.js` for your videos.**

3. **Run the YAUploader:**
    * Run `node start` to start the auto uploader.
    * The Repl will prompt you to authorize the app to access your YouTube account.
    * Follow the instructions on the screen to complete the authorization process.

4. **Upload Videos:**
    * The YAUploader will automatically scan the `videos` directory for new videos and upload them according to your configured schedule. 

## Customization

* **Upload Schedule:** Modify the `delay` function in `index.js` to adjust the upload schedule.
* **Video Settings:** Adjust the title, description, tags, and category for each video in `index.js`. 
* **Video Directory:** Change the `VIDEO_DIR` variable to a different directory if needed.

## Notes

* Ensure that the video files in the `videos` directory are in MP4 format.
* The YAUpload will continue to run indefinitely until you stop it.
* The upload schedule is based on the delays specified in the code. 
