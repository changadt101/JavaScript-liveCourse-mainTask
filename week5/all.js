import zh_TW from './zh_TW.js';

VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    },
});

VeeValidate.localize('tw', zh_TW);

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

Vue.use(VueLoading);

Vue.component('loading', VueLoading);

Vue.filter('money', function(num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + parts.join('.');
});

new Vue({
    el: '#app',
    data: {
        products: [],
        tempProduct: {
            origin_price: 0,
        },
        status: {
            loadingItem: '',
            loadingAddToCart: '',
            loadingAddToCartFromDetailCheck: false,
            loadingUpdateCart: '',
            loadingUpdateCartButtonCheck: '',
        },
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: '',
        },
        carts: [],
        cartTotal: 0,
        isLoading: false,
        uuid: '23ae3a1b-ed5e-4d05-89f5-1937834895dd',
        apiPath: 'https://course-ec-api.hexschool.io/api/',
    },
    methods: {
        getProducts(page = 1) {
            this.isLoading = true;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/products?page=${page}`;

            axios.get(apiUrl)
                .then((response) => {
                    this.isLoading = false;
                    this.products = response.data.data;
                })
                .catch((error) => {
                    this.isLoading = false;
                });
        },
        getProductDetail(id) {
            this.status.loadingItem = id;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/product/${id}`;

            axios.get(apiUrl)
                .then((response) => {
                    this.status.loadingItem = '';
                    this.tempProduct = response.data.data;

                    this.tempProduct = {
                        ...response.data.data,
                        num: 1
                    };

                    $('#productModal').modal('show');
                });
        },
        addToCart(id, quantity = 1, isFormDetail) {
            this.status.loadingAddToCart = id;

            if (isFormDetail) {
                this.status.loadingAddToCartFromDetailCheck = isFormDetail;
            }

            const apiUrl = `${this.apiPath}${this.uuid}/ec/shopping`;

            const params = {
                product: id,
                quantity,
            };

            axios.post(apiUrl, params)
                .then(() => {
                    this.status.loadingAddToCart = '';
                    this.status.loadingAddToCartFromDetailCheck = false;
                    $('#productModal').modal('hide');
                    this.getCart();
                })
                .catch((error) => {
                    this.status.loadingAddToCart = '';
                    this.status.loadingAddToCartFromDetailCheck = false;
                    console.log(error.response.data.errors);
                    $('#productModal').modal('hide');
                });
        },
        getCart() {
            this.isLoading = true;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/shopping`;

            axios.get(apiUrl)
                .then((response) => {
                    this.carts = response.data.data;
                    this.updateTotal();
                    this.isLoading = false;
                });
        },
        updateTotal() {
            this.cartTotal = 0;

            this.carts.forEach((item) => {
                this.cartTotal += item.product.price * item.quantity;
            });
        },
        quantityUpdata(id, num, button) {
            if(num <= 0) return;

            this.status.loadingUpdateCart = id;

            this.status.loadingUpdateCartButtonCheck = button;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/shopping`;

            const data = {
                product: id,
                quantity: num,
            };

            axios.patch(apiUrl, data)
                .then(() => {
                    this.status.loadingUpdateCart = '';
                    this.status.loadingUpdateCartButtonCheck = '';
                    this.getCart();
                });
        },
        removeAllCartItem() {
            this.isLoading = true;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/shopping/all/product`;

            axios.delete(apiUrl)
                .then(() => {
                    this.isLoading = false;
                    this.getCart();
                });
        },
        removeCartItem(id) {
            this.isLoading = true;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/shopping/${id}`;

            axios.delete(apiUrl)
                .then(() => {
                    this.isLoading = false;
                    this.getCart();
                });
        },
        createOrder() {
            this.isLoading = true;

            const apiUrl = `${this.apiPath}${this.uuid}/ec/orders`;

            axios.post(apiUrl, this.form)
                .then((response) => {
                    if (response.data.data.id) {
                        this.isLoading = false;
                        $('#orderModal').modal('show');
                        this.getCart();
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    console.log(error.response.data.errors);
                });
        },
    },
    created() {
        this.getProducts();
        this.getCart();
    },
});