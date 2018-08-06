angular.module("dmk", ["ngRoute", "ngMaterial", "ngAria"])
    .config(function ($routeProvider) {
        var routes = [
            'home', 'view_student', 'add_students', 'add_teacher', 'view-departments',
            'add-class', 'time-table', 'add_fee', 'fee_types', 'pay', 'addemp', 'leave',
            'generate_salary', 'salary_structure', 'enquiry', 'view_enquiry', 'admission', 'view_admission'
        ];
        function setRoutes(route) {
            var url = '/' + route,
                config = {
                    templateUrl: "templates/" + route + ".html",
                    controller: route
                };
            $routeProvider.when(url, config);
            return $routeProvider;
        }
        routes.forEach(function (route) {
            setRoutes(route);
        });

        $routeProvider
            .when('/', { templateUrl: "templates/home.html" })
            .when('/404', { templateUrl: '/templates/404.html' })
            .otherwise({ redirectTo: '/404' })
    })

