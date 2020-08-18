const modal = document.querySelector('.modal');
const original = document.querySelector('.full-img');
const caption = document.querySelector('.caption');
const preview = document.querySelector('.post-photo img');

{
    preview.addEventListener('click', () => {
        modal.classList.add('open');
        original.classList.add('open');
        const originalSrc = preview.getAttribute('data-original');
        original.src = `${originalSrc}`;
        console.log('1');
    });
}


modal.addEventListener('click', (e) => {
    if(e.target.classList.contains('modal')){
        modal.classList.remove('open');
        original.classList.remove('open');
    }

});