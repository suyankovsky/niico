import $ from 'jquery';

export default class {
    constructor(xml) {
        const mylist_group = [];

        $(xml).find('mylistgroup').each((index, el) => {
            mylist_group.push(
                this.parseIndividualMylistGroup(el)
            );
        });

        return mylist_group;
    }

    parseIndividualMylistGroup(el) {
        const return_obj = {};
        const $el = $(el);

        this.getParsePropertyNames().forEach((prop_name) => {
            return_obj[prop_name] = $el.children(prop_name).text();
        });

        return return_obj;
    }

    getParsePropertyNames() {
        return [
            'id',
            'user_id',
            'view_counter',
            'name',
            'description',
            'public',
            'default_sort',
            'icon_id',
            'sort_order',
            'update_time',
            'create_time',
            'count',
            'default_sort_method',
            'default_sort_order',
        ];
    }
}
