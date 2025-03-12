const video = document.getElementById('videoPlayer');
const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', sourceOpen);

async function sourceOpen() {
    const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'); // Adjust codecs as needed.
    let byteStart = 0;
    const chunkSize = 1024 * 1024; // 1MB chunk size
    let isFetching = false;

    async function fetchVideoChunk(start) {
        if (isFetching) return;
        isFetching = true;

        try {
            const response = await fetch(`/video`, {
                headers: { Range: `bytes=${start}-${start + chunkSize - 1}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            sourceBuffer.appendBuffer(buffer);
            byteStart += buffer.byteLength;
            isFetching = false;

        } catch (error) {
            console.error('Error fetching video chunk:', error);
            isFetching = false;
        }

    }

    sourceBuffer.addEventListener('updateend', () => {
        if (!sourceBuffer.updating && video.buffered.length > 0 && video.buffered.end(0) < video.duration) {
            fetchVideoChunk(byteStart);
        }
    });

    video.addEventListener('timeupdate', () => {
        if (video.buffered.length > 0 && video.buffered.end(0) - video.currentTime < 5 && !sourceBuffer.updating) {
            fetchVideoChunk(byteStart);
        }
    });

    fetchVideoChunk(byteStart); // Initial fetch
}