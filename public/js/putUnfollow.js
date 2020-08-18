function putUnfollow(btn){
    const userId = btn.parentNode.querySelector('#userId').value;
    //btn.src = '/public/images/heart (2).svg';
    
    if(btn.innerHTML === 'Follow'){
        btn.innerHTML = 'Unfollow';
        fetch('/user/follow/' + userId, {
            method:'POST'
        })
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(data => {
            document.querySelector('#followers').innerHTML = `${data.followers} followers`;
        })
        .catch((err) => {
            console.log(err);
        });
    }
    else if(btn.innerHTML === 'Unfollow'){
        btn.innerHTML = 'Follow';
        fetch('/user/unfollow/' + userId, {
            method:'DELETE'
        })
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(data => {
            document.querySelector('#followers').innerHTML = `${data.followers} followers`;
        }).catch((err) => {
            console.log(err);
        });
    }

}