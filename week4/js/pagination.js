export default {
    template: `<nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled': pages.current_page === 1}">
                <a class="page-link" href="#" aria-label="Previous" @click.prevent="switchPages(pages.current_page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li v-for="(item, index) in pages.total_pages" :key="index" class="page-item" :class="{'active': item === pages.current_page}">
                <a class="page-link" href="#" @click.prevent="switchPages(item)">{{ item }}</a>
            </li>

            <li class="page-item" :class="{'disabled': pages.current_page === pages.total_pages}">
                <a class="page-link" href="#" aria-label="Next" @click.prevent="switchPages(pages.current_page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`,
    props: ['pages'],
    methods: {
        switchPages(page) {
            this.$emit('switch-other-pages', page);
        }
    }
};