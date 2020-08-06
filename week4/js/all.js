import pagination from './pagination.js';

Vue.component('pagination', pagination);

new Vue({
    el: '#app',
    data: {
        products: [],
        pagination: {},
        tempProduct: {
            imageUrl: [],
        },
        isNew: false,
        status: {
            fileUploading: false,
        },
        apiPath: 'https://course-ec-api.hexschool.io/api/',
        user: {
            token: '',
            uuid: '23ae3a1b-ed5e-4d05-89f5-1937834895dd',
        },
        loadingButton: ''
    },
    created() {
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

        if (this.user.token === '') {
            window.location = 'login.html';
        }

        this.getProducts();
    },
    methods: {
        getProducts(page) {
            if (!page) {
                page = 1;
            }

            const apiUrl = `${this.apiPath}${this.user.uuid}/admin/ec/products?page=${page}`;
  
            axios.get(apiUrl)
                .then((response) => {
                    this.products = response.data.data;
                    this.pagination = response.data.meta.pagination;
                });
        },
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.tempProduct = {
                        imageUrl: [],
                    };
                    
                    this.isNew = true;

                    $('#productModal').modal('show');
                    break;
                case 'edit':
                    this.loadingButton = item.id;

                    this.getProductContent(item.id);

                    this.isNew = false;
                    break;
                case 'delete':
                    this.tempProduct = Object.assign({}, item);

                    $('#delProductModal').modal('show');
                    break;
                default:
                    break;
            }
        },
        getProductContent(id) {
            const apiUrl = `${this.apiPath}${this.user.uuid}/admin/ec/product/${id}`;
            axios.get(apiUrl)
                .then((res) => {
                    this.tempProduct = res.data.data;

                    $('#productModal').modal('show');

                    this.loadingButton = '';
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        updateProduct() {
            let apiUrl = `${this.apiPath}${this.user.uuid}/admin/ec/product`;
            let httpMethod = 'post';

            if (!this.isNew) {
                apiUrl = `${this.apiPath}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
                httpMethod = 'patch';
            }
  
            axios[httpMethod](apiUrl, this.tempProduct)
                .then(() => {
                    $('#productModal').modal('hide');

                    this.getProducts();
                })
                .catch((error) => {
                    console.log(error)
                });
        },
        uploadFile() {
            const fileBeUploaded = document.querySelector('#customFile').files[0];

            const formData = new FormData();
            formData.append('file', fileBeUploaded);

            const apiUrl = `${this.apiPath}${this.user.uuid}/admin/storage`;
            this.status.fileUploading = true;

            axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                this.status.fileUploading = false;

                if (response.status === 200) {
                    this.tempProduct.imageUrl.push(response.data.data.path);
                }
            }).catch(() => {
                console.log('上傳不可超過 2 MB');

                this.status.fileUploading = false;
            });
        },
        delProduct() {
            const apiUrl = `${this.apiPath}${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
  
            axios.delete(apiUrl)
                .then(() => {
                    $('#delProductModal').modal('hide');
                    this.getProducts();
                });
        },
    },
})