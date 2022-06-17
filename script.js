let search = document.querySelector('.search-btn');
search.addEventListener("click", function() {
    let input = document.querySelector('.search-input').value;
    if(input == ""){
        alert("Enter the search input");
        return;
    }
    let total_videos = 50; 
    fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyB-iBBIztlKJKVd2KE8zLGtVnkezHDYbAY&type=video&part=snippet&maxResults=${total_videos}&q=${input}`)
    .then(res => res.json())
    .then(res => {
        let ids = [];
        for (let video of res.items) {
            ids.push(video.id.videoId);
        }
        fetch(`https://www.googleapis.com/youtube/v3/videos?key=AIzaSyB-iBBIztlKJKVd2KE8zLGtVnkezHDYbAY&id=${ids.join(',')}&part=snippet,statistics`)
        .then(data => data.json())
        .then(data => {
            console.log(data);
            renderVideos(data.items,total_videos)
        });
    });
})
function videoDet(){
    let counter = 1;
    document.querySelector(".videos-listing").innerHTML = '';
    for (let video of videos) {
        videoDetails(video,counter++);
    }
}
function renderVideos(videoData,total_videos) {
    let videos_per_page = 15;
    let no_of_pages = Math.ceil(total_videos / videos_per_page);
    
    pagination(no_of_pages);
    
    let videos = videoData.slice(0,videos_per_page);
    videoDet();

    let pages = document.querySelectorAll(".page-btn");
    for(let page of pages){
        page.addEventListener("click",function(){
            let pageNo = this.innerHTML;
            let start = (pageNo - 1) * videos_per_page;
            let end = start + videos_per_page;
            let videos = videoData.slice(start,end);
           videoDet();
       });
    }
}

function pagination(no_of_pages){
    let pageHTML = '';
    for (let i = 1; i <= no_of_pages; i++) {
        pageHTML += `<button class="page-btn" id="btn${i}">${i}</button>`;
    }
    document.getElementById('pages-container').innerHTML = pageHTML;
}

function videoDetails(video, i) {
    console.log(video);
    var id = video.id;
    var thumbnail = video.snippet.thumbnails.high.url;
    var title = video.snippet.title;
    var desc = video.snippet.description.substring(0, 100);
    var author = video.snippet.channelTitle;
    var views = video.statistics.viewCount
    var published = video.snippet.publishedAt.substring(0, 10).split("-").join("/");
    document.getElementById('videos-list').innerHTML += 
        `<div class="video" id="videoNo${i}">
            <a href="https:youtube.com/watch?v=${id}">
                <img src="${thumbnail}" alt="thumb" align="center" class="thumbnail" id="img${i}">
            
            <div class = "details">
                <h4>${title}</h4></a>
                <div class="metaData">
                <div class="views">Views: ${views}</div>
                <div class="published">Uploaded on: ${published}</div>
            </div>
            <div class="author">Channel: ${author}</div>
                <p class="desc">${desc}</p>
            </div>
        </div>`;
}  