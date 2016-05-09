module test.route.Main
import path, interceptor, assert, cors from realm.router;


@cors()
@path("/")
@interceptor("test.interceptors.Permission")

class MainRoute {
   static get($query){

      return { a :$query.get("hello@int", 1) }
   }
   static post(){

   }
};

export MainRoute;
