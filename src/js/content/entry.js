import $ from 'jquery';
import Vue from 'vue';
import store from 'js/content/store';
import App from 'js/content/components/app.vue';

//window.onbeforeunload = function(e) {e.returnValue = "ページを離れようとしています。よろしいですか？";}

$('body').prepend(`<div id="niico-loading-bar"></div>`);
$('body').append(`<div id="niico-app"></div>`);

window.niico =  new Vue({
    el: '#niico-app',
    store,
    render: h => h(App),
});
