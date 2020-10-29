import {axios} from './config';

function getAllDates(){
    return axios({
        url:'/api/dates',
    })
};

function reReadImages(){
    return axios({
        method:'post',
        url:'/api/read',
    })
}

function getImagesInfo(date:string){
    return axios({
        method:'get',
        url:'/api/images',
        params:{date}
    })
}

export {getAllDates,reReadImages,getImagesInfo};