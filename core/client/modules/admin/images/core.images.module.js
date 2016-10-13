import imagesResources from './services/core.images.constant';
import Image from './services/core.images.model';
import imagesManager from './services/core.images.manager';
import ImagesCtrl from './controllers/core.images.controller';

export default angular.module("core.images", [])
    .constant("imagesResources", imagesResources)
    .factory("Image", Image)
    .service("imagesManager", imagesManager)
    .controller("ImagesCtrl", ImagesCtrl)
    .name;