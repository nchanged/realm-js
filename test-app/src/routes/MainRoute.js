module test.route.Main
import path, interceptors, assert, cors from realm.router;


@cors()
@path("/")
@interceptors("Permission","SomeStuff")

class MainRoute {
   static get($query, $pukka){

      return { a : $pukka }
   }
   static post(){

   }
};

export MainRoute;
