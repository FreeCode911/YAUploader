## 🎥 YAUploader: Automated YouTube Video Uploads 🚀

YAUploader is your go-to tool for automating video uploads to your YouTube channel, allowing you to schedule and manage your content effortlessly!

## 🌟 Features

- **⏩ Automatic Video Upload:** Uploads videos from a specified directory directly to your YouTube channel.
- **🕒 Scheduled Uploads:** Set specific times for your videos to go live.
- **📝 Customizable Titles, Descriptions, and Tags:** Tailor the metadata for each video to maximize engagement.
- **📂 Category Selection:** Ensure your videos are placed in the correct YouTube category.
- **📊 Upload Progress Tracking:** Monitor the upload status in real-time via the console.
- **⚠️ Error Handling:** Robust error management ensures smooth uploads with clear issue reporting.

## 🚀 Getting Started

1. **🎛️ Set up Google Cloud Platform (GCP) Project:**
    * Create a new GCP project and enable the YouTube Data API.
    * Head to [YouTube Data API Library](https://console.cloud.google.com/apis/library/youtube.googleapis.com) and enable it.
    * Generate an API Key for your project.
    * Download your credentials file from the Google Cloud Console.

2. **🔧 Configure the YAUploader:**
    * Replace placeholder values in `credentials.json` with your GCP API credentials.
    * Create a `videos` directory in the Repl to store your video files.
    * Set the `VIDEO_DIR` variable in `index.js` to the path of your video directory.
    * Customize the `title`, `description`, `category`, and `tags` in `Config.js` to suit your videos.

3. **▶️ Run the YAUploader:**
    * Execute `node start` to initiate the auto uploader.
    * Follow the on-screen instructions to authorize the app to access your YouTube account.

4. **🎬 Upload Videos:**
    * The YAUploader will automatically scan the `videos` directory and upload videos based on your schedule.

## 🎨 Customization

- **⏰ Upload Schedule:** Modify the `config.js` 
- **🎥 Video Settings:** Adjust titles, descriptions, tags, and categories in `config.js` for each upload.
- **📁 Video Directory:** Change the `VIDEO_DIR` variable to point to a different directory if needed.

## 📝 Notes

- Ensure video files in the `videos` directory are in MP4 format.
- YAUploader runs continuously until stopped.
- Upload schedules are based on the delays set in the code.
