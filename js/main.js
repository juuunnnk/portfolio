var animData = {
    container: document.getElementById('lottie'),
    renderer: 'svg',
    loop: false,
    prerender: true,
    autoplay: true,
    path: './js/data.json'
};
var anim = lottie.loadAnimation(animData);
