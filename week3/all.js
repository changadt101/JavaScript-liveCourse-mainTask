new Vue({
    el: '#app',
    data: {
        myProducts: [
            {
                id: 6947173309482,
                unit: '支',
                category: '復古風尚',
                title: 'Black Citizen Chronograph Watch',
                origin_price: 36000,
                price: 13999,
                description: '牛皮材質的錶帶襯托不凡的氣質',
                content: '復古的造型設計，搭配經典褐色錶帶，展現成熟穩重的氣質',
                is_enabled: 1,
                imageUrl: 'https://images.unsplash.com/photo-1507428861205-e8aab693190e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            },
            {
                id: 6283478234815,
                unit: '支',
                category: '時尚潮流',
                title: 'Silver-Colored Analog Watch',
                origin_price: 81000,
                description: '金色邊框的點綴更能凸顯價值',
                content: '高貴的邊框設計，用簡約的風格帶出低調奢華的感覺',
                price: 56566,
                is_enabled: 0,
                imageUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            },
            {
                id: 6454077606229,
                unit: '支',
                category: '商務經典',
                title: 'Diamond Digital Watch',
                origin_price: 32100,
                description: '樸實與科技感兼具的設計呈現',
                content: '多種色調的搭配，豐富不失美感，是商務交際的第一選擇',
                price: 19453,
                is_enabled: 1,
                imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
            }
        ],
        newProduct: {}
    },
    methods: {
        updateProduct() {
            if (this.newProduct.id) {
                const id = this.newProduct.id;
                this.myProducts.forEach((item, i) => {
                    if (item.id === id) {
                        this.myProducts[i] = this.newProduct;
                    }
                });
            } else {
                // Unix Timestamp
                const id = new Date().getTime();
                this.newProduct.id = id;
                this.myProducts.push(this.newProduct);
            }

            this.newProduct = {};
            $('#myProductListModal').modal('hide');
        },
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.newProduct = {};
                    $('#myProductListModal').modal('show');
                    break;
                case 'edit':
                    this.newProduct = Object.assign({}, item);
                    $('#myProductListModal').modal('show');
                    break;
                case 'delete':
                    $('#deleteProductModal').modal('show');
                    this.newProduct = Object.assign({}, item);
                    break;
                default:
                    break;
            }
        },
        deleteProduct() {
            if (this.newProduct.id) {
                const id = this.newProduct.id;
                this.myProducts.forEach((item, i) => {
                    if (item.id === id) {
                        this.myProducts.splice(i, 1);
                        this.newProduct = {};
                    }
                });
            }

            $('#deleteProductModal').modal('hide');
        }
    }
});