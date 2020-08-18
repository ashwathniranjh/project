function likePost(btn){
    // const postId = btn.parentNode.querySelector('postId').value;
    const postId = document.querySelector('#postId').value;
    btn.src = '/images/heart (2).svg';
    

    fetch('/user/post/like/' + postId, {
        method:'PUT'
    })
    .then(result => {
        return result.json();
    
    })
    .then(data => {
        console.log(data);
        document.querySelector('#likes').innerHTML =  `${data.likes} likes`;
    })
    .catch((err) => {
        console.log(err);
    });
}