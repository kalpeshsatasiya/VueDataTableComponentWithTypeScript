import Vue from 'vue';
import { Component } from 'vue-property-decorator';


@Component({
    components: {
        DataTableComponent: require('../datatable/datatable.vue.html')
    }
})
//@Component
export default class FetchDataComponent extends Vue {
    deleteRow: any = {};
    tableData: any = {
        options: {
            sortable: true,
            editable: true,
            pageCount: 10
        },

        columns: [
            {
                value: 'id',
                text: 'ID',
                sortable: true,
                editable: false
            },
            {
                value: 'name',
                text: 'Name',
                sortable: true,
                editable: true
            },
            {
                value: 'age',
                text: 'Age',
                sortable: true,
                editable: true
            },
            {
                value: 'sex',
                text: 'Sex',
                sortable: true,
                editable: true
            },
            {
                value: 'link',
                text: 'Link',
                sortable: false,
                editable: false,
                isHTML: true
            },
            {
                value: 'action',
                text: 'Action',
                sortable: false,
                editable: false,
                isButton: true
            }
        ],

        rows: [],

        onPageChanged(page: any) {
            console.log('Current page is ' + page);
        }
    }
    mounted() {
        let self = this;
        for (let i = 0; i < 50; i++) {
            const obj = {
                id: {
                    value: i + 1,
                },

                name: {
                    value: 'name' + i,
                    editable: i % 2 == 0 ? true : false
                },

                age: {
                    value: i,
                    editable: i % 2 == 0 ? true : false
                },

                sex: {
                    value: i % 2 == 0 ? 'Male' : 'Female',
                    editable: i % 2 == 0 ? true : false
                },

                link: {
                    value: `<a href="www.tech-coder.com">www.tech-coder.com</a>`
                },

                action: {
                    value: [
                        {
                            text: 'Edit',
                            class: ['btn btn-info'],
                            func: function (event: any, column: any, field: any, row:any) {
                                console.log('event', event);
                                console.log('column', column);
                                console.log('field', field);
                                console.log('row', row);
                            }
                        },
                        {
                            text: 'Delete',
                            class: ['btn btn-primary'],
                            func: function (event: any, column: any, field: any, row:any) {
                                console.log('event', event);
                                console.log('column', column);
                                console.log('field', field);
                                console.log('row', row);
                                self.deleteRow = row;
                            },
                            isModel: true,
                            model: "#myModal"
                        }
                    ]
                }
            }

            this.tableData.rows.push(obj);
        }
    }

    deleteRecord(row: any) {
        console.log(row);
        //delete record using deleteRow object
        console.log(row["id"]["value"]);
    }
}
