var homeConfig = {
    pageIndex: 1,
    pageSize: 5
};
var EmployeeController = {
    init: function () {
        EmployeeController.loadData();
    },

    registerEvent: function () {
        $('#btnSearch').off('click').on('click', function () {
            EmployeeController.loadData(true);
        });

        $('#txtNameS').off('keypress').on('keypress', function (e) {
            if (e.which === 13) {
                EmployeeController.loadData(true);
            }
        });

        $('#btnAddNew').off('click').on('click', function () {
            $('#modalAddUpdate').modal('show');
        });

        $('#btnSave').off('click').on('click', function () {
            EmployeeController.saveData();
        });

    },

    saveData: function () {
        var name = $('#txtName').val();
        var salary = $('#txtSalary').val();
        var status = $('#ckStatus').prop('checked');
        var id = $('#hidID').val();
        var employee = {
            Name: name,
            Salary: salary,
            Status: status,
            Id: id
        };

        $.ajax({
            url: '/Employees/SaveData',
            type: 'POST',
            data: {
                strEmployee: JSON.stringify(employee)
            },
            dataType: 'json',
            success: function (response) {
                if (response.status === true) {
                    bootbox.alert("Save Success", function () {
                        $('#modalAddUpdate').modal('hide');
                        EmployeeController.loadData(true);
                    });

                }
                else {
                    bootbox.alert(response.message);
                }
            }
        });
    },

    loadData: function (changePageSize) {
        var name = $('#txtNameS').val();
        var status = $('#ddlStatusS').val();

        $.ajax({
            url: '/Employees/LoadData',
            type: 'GET',
            data: {
                name: name,
                status: status,
                page: homeConfig.pageIndex,
                pageSize: homeConfig.pageSize
            },
            dataType: 'json',
            success: function (response) {
                if (response.status) {
                    var data = response.data;
                    var html = '';
                    var template = $('#data-template').html();

                    $.each(data, function (i, item) {
                        html += Mustache.render(template, {
                            Id: item.id,
                            Name: item.name,
                            Salary: item.salary,
                            Status: item.status === true ? "<span class=\"badge badge-success\">Actived</span>" : "<span class=\"badge badge-danger\">Locked</span>"
                        });

                    });

                    $('#tblData').html(html);
                    EmployeeController.paging(response.total, function () {
                        EmployeeController.loadData();
                    }, changePageSize);
                    EmployeeController.registerEvent();
                }
            }
        });
    },

    paging: function (totalRow, callback, changePageSize) {
        var totalPage = Math.ceil(totalRow / homeConfig.pageSize);//lam tron len

        //unbind pagination if it existed or click change size ==> reset
        if (('#pagination a').length === 0 || changePageSize === true) {
            $('#pagination').empty();
            $('#pagination').removeData('twbsPagination');
            $('#pagination').unbind("page");
        }

        $('#pagination').twbsPagination({
            totalPages: totalPage,
            first: "Đầu",
            next: "Tiếp",
            last: "Cuối",
            prev: "trước",
            visiblePages: 10, // tong so trang hien thi , ...12345678910...
            onPageClick: function (event, page) {
                homeConfig.pageIndex = page;//khi chuyen trang thi set lai page index
                setTimeout(callback, 200);
            }
        });
    }
};
EmployeeController.init();
