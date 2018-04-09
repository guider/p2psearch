function sayHello() {
    var text = $clipboard.text;
    if (!text || text.length > 10) {
        $input.text({
            handler: function(inputText) {
                doRequest(inputText)
            }
        })
        return;
    }
    doRequest(text)
    $clipboard.clear()
    // $ui.menu({
    //     items: [text, "输入内容"],
    //     handler: function(title, idx) {
    //         if (idx == 0) {
    //             doRequest(text)
    //         } else {
    //             $input.text({
    //                 handler: function(text) {
    //                     doRequest(text)
    //                 }
    //             })
    //         }
    //     }
    // })
}

function doRequest(text) {

    $http.request({
        method: "POST",
        url: "http://api.prguanjia.com/table/searchListApi",
        header: {
            version: "v1",
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
            param: JSON.stringify({
                "keyword": [text]
            })
        },
        handler: function(resp) {
            var data = resp.data.data.data
            if (data && data.length) {
                renderUi(formatData(data));
            } else {
                $ui.alert({
                    title: "友情提示",
                    message: "暂未查找到 [ " + text + " ]",
                })
            }
        }
    })
}

function renderUi(data) {
    $ui.render({
        props: {
            title: '评测'
        },
        views: [{
            type: "list",
            props: {
                data: data,
                rowHeight: 200.0,
                separatorInset: $insets(0, 5, 0, 0),
                template: [{
                        type: "label",
                        props: {
                            id: "label",
                            font: $font("bold", 17),
                            lines: 0
                        },

                        layout: function(make) {
                            make.left.inset(10)
                            make.top.equalTo(15)
                            make.right.inset(10)
                            make.height.equalTo(20)
                        }
                    },
                    {
                        type: "label",
                        props: {
                            id: "time",
                            font: $font(16),
                            lines: 0,
                            textColor: $color("#777777"),
                            radius: 2
                        },
                        layout: function(make) {
                            make.left.equalTo($("label"))
                            make.top.equalTo($("label").bottom).offset(5)
                            make.bottom.equalTo(-15)
                            make.right.equalTo(-10)
                        }
                    },
                ],
                actions: [{
                    title: "复制",
                    handler: function(tableView, indexPath, advice) {}
                }]
            },

            layout: $layout.fill,
            events: {
                rowHeight: function(sender, indexPath) {

                    // $ui.alert({
                    //     title: "",
                    //     message: data[indexPath.row].time.text,
                    // })
                    return data[indexPath.row].time.text.length / 20 * 20 + 70

                },
                didSelect: function(tableView, indexPath, item) {
                    $clipboard.text = item.time.text
                    $device.taptic()
                    $ui.toast('已复制')
                }
            }
        }]
    })

}

function formatData(data) {
    let resultArr = [];
    data.forEach(item => {
        resultArr.push({
            label: {
                text: item.platform
            },
            time: {
                text: item.advice
            }
        })
    });
    return resultArr;

}

module.exports = {
    sayHello: sayHello
}
