module test.injectors.Permission;


import inject from realm.router;
import SomeStuff from test.injectors

@inject(SomeStuff)

class Permission {
   static inject($req, $attrs, SomeStuff)
   {
      return {"permission yee": "hello world", something : SomeStuff, attrs :$attrs}
   }
}

export Permission;
