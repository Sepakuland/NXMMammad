export const accountParty = [{
    id: 1,
    text: 'طرف حساب ها',
    expanded: true,
    items: [
        {
            id: "1.1",
            text: 'تأمین کنندگان',
            expanded: false,
            selected: true

        }, {
            id: "1.2",
            text: 'کرمانشاه',
            expanded: false,
            selected: true,
            items: [{
                id: "1.2.1",
                text: 'شهرستان ها',
                selected: true

            }, {
                id: "1.2.2",
                text: 'شهر کرمانشاه'
            }],
        }, {
            id: "1.3",
            text: 'بندرعباس',
            expanded: false,
            items: [{
                id: "1.3.1",
                text: 'منطقه 1',
                expanded: false,
                selected: true
            },],
        },
    ]
}];

export const customers = [{
  id: 1,
  text: 'گروه های مشتریان',
  expanded: true,
  items: [
    {
      id: "1.1",
      text: 'افق کوروش',
      selected: true

    },
     {
      id: "1.2",
      text: 'سوپرمارکت',
      selected: true

    },
     {
      id: "1.3",
      text: 'فروشگاه رفاه',
      selected: true

    },
     {
      id: "1.4",
      text: 'فست فود',
      selected: true

    },

  ]
}];



