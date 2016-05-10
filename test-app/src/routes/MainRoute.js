module test.route.Main
import path, inject, assert, cors from realm.router;

import Permission from test.injectors

@cors()
@path("/")

@inject(Permission, '$permission')

class MainRoute {
    static get($query, $permission) {

        return {
            a: $permission
        }
    }
    static post() {

    }
};

export MainRoute;
