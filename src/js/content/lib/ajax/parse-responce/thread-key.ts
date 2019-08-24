export default function (responce) {
    const param_array = responce.split('&');
    let return_param_array = {};

    for (let i = 0; i < param_array.length; i++) {
        let key_value = (param_array[i]).split('=');
        return_param_array[key_value[0]] = decodeURIComponent(key_value[1]);
    }
    return return_param_array;
}
