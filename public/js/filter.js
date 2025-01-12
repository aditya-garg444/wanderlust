document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('.filter');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const selectedFilter = filter.getAttribute('data-filter');
            window.location.href = `/listings?filter=${encodeURIComponent(selectedFilter)}`;
        });
    });
    const urlParams = new URLSearchParams(window.location.search);
    const activeFilter = urlParams.get('filter') || 'All';

    filters.forEach(filter => {
        if (filter.getAttribute('data-filter') === activeFilter) {
            filter.classList.add('active-filter');
        } else {
            filter.classList.remove('active-filter');
        }
    });
});
