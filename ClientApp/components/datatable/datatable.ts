import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component
export default class DataTableComponent extends Vue {
    currentPage: number = 1;
    searchBy: string = '';
    rows: any[] = [];
    sort: any = {
        sortBy: '',
        desc: true
    }

    @Prop({ type: Object })
    dataTable: any;

    get pagination() {
        return this.getPageRows(this.filteredRows);
    }
    get filteredRows() {
        return this.filterRows(this.dataTable.rows, this.dataTable.options, this.currentPage);
    }
    get lastPage() {
        return Math.ceil(this.filteredRows.length / this.dataTable.options.pageCount);
    }
    get centerPartPage() {
        if (this.lastPage > 10 && this.currentPage >= 5) {
            if (this.lastPage - this.currentPage > 5) {
                return this.currentPage === this.lastPage ? [this.currentPage - 3, this.currentPage - 2, this.currentPage - 1] : [this.currentPage - 2, this.currentPage - 1, this.currentPage];
            } else {
                const r = [];
                for (let i = this.lastPage - 6; i < this.lastPage; i++) {
                    r.push(i);
                }
                return r;
            }
        } else if (this.lastPage > 10) {
            const r = [];
            for (let i = 1; i < 5; i++) {
                r.push(i);
            }
            return r;
        } else {
            const r = [];
            for (let i = 1; i < this.lastPage; i++) {
                r.push(i);
            }
            return r;
        }
    }
    get lastPartPage() {
        if (this.lastPage > 10 && this.lastPage - this.currentPage > 5) {
            return [this.lastPage - 1];
        } else {
            return [];
        }
    }
    get firstRow() {
        return this.currentPage === 1 ? 0 : this.dataTable.options.pageCount * (this.currentPage - 1);
    }
    get lastRow() {
        return this.dataTable.options.pageCount * this.currentPage > this.filteredRows.length ? this.filteredRows.length : this.dataTable.options.pageCount * this.currentPage;
    }

    //Methods
    onChangePageCount() {
        this.currentPage = 1;
    }
    filterRows(rows: any, options: any, currentPage: number) {
        rows = this.sort.sortBy ? this.sortRows(rows, this.sort.sortBy) : rows;

        if (this.searchBy !== '') {
            rows = rows.filter((row: any) => {
                let r = false;
                for (let key in row) {
                    if (row[key].value
                        .toString()
                        .toLowerCase()
                        .indexOf(this.searchBy.toLowerCase()) !== -1) {
                        r = true;
                    }
                }
                return r;
            });
        }
        return rows;
    }
    getPageRows(rows: any) {
        return rows.slice(this.firstRow, this.lastRow);
    }
    togglePage(page: any) {
        switch (page) {
            case 'prev':
                if (this.currentPage <= 1) return;
                this.currentPage--;
                break;
            case 'next':
                if (this.currentPage >= this.lastPage) return;
                this.currentPage++;
                break;
            default:
                if (this.currentPage == page) return;
                this.currentPage = page;
        }
        if (this.dataTable.onPageChanged) {
            this.dataTable.onPageChanged(this.currentPage);
        }
    }
    sortBy(column: any) {
        if (!column.sortable || !this.dataTable.options.sortable) return;
        if (column.value === this.sort.sortBy) {
            this.sort.desc = !this.sort.desc;
        } else {
            this.sort.sortBy = column.value;
            this.sort.desc = true;
        }
    }
    editField(field: any, key: string) {
        if (!this.isEditable(field, key, true)) return;
        field.tmpValue = field.value;
        field.editing = true;
    }
    saveEdit(field: any) {
        field.value = field.tmpValue;
        field.editing = false;
        field.tmpValue = '';
    }
    cancelEdit(field: any) {
        field.editing = false;
        field.tmpValue = '';
    }
    sortRows(rows: any, sortBy: string) {
        const arr = rows.slice(0);
        return arr.sort((a: any, b: any) => {
            const r = this.sort.desc ? a[sortBy].value < b[sortBy].value : a[sortBy].value > b[sortBy].value;
            return r ? 1 : -1;
        })
    }
    isSortable(column: any) {
        return column.sortable && this.dataTable.options.sortable;
    }
    isEditable(field: any, key: any, beforeEditing: boolean) {
        const column = this.dataTable.columns.filter((column: any) => {
            return column.value === key;
        })[0];
        if (beforeEditing) {
            return field.editable && this.dataTable.options.editable && column.editable;
        } else {
            return field.editable && this.dataTable.options.editable && field.editing && column.editable;
        }
    }
    isHTML(key: any) {
        let data = this.dataTable.columns.filter((column: any) => {
            return column.value === key;
        });
        if (data.length > 0)
            return data[0].isHTML;
        else false;
    }
    isButton(key: any) {
        let data = this.dataTable.columns.filter((column: any) => {
            return column.value === key;
        });
        if (data.length > 0)
            return data[0].isButton;
        else false;
    }

    //Watches
    @Watch('dataTable.rows')
    'dataTable.rows'(rows: any) {
        rows.forEach((row: any, index: number) => {
            for (let key in row) {
                const column = this.dataTable.columns.filter((column: any) => {
                    return column.value === key;
                })[0];

                row[key] = (<any>Object).assign({
                    editable: column.editable,
                    editing: false,
                    tmpValue: ''
                }, row[key]);
            }
            this.dataTable.rows[index] = row;
        });
    }
    @Watch('dataTable.columns')
    'dataTable.columns'(columns: any) {
        columns.forEach((column: any, index: number) => {
            column = (<any>Object).assign({
                editable: false,
                sortable: false
            }, column);
            this.dataTable.columns[index] = column;
        })
    }
    @Watch('searchBy')
    'searchByWatcher'(val: any) {
        if (val) {
            this.currentPage = 1;
        }
    }
}
