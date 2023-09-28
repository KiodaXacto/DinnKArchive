
import { CommonActions } from "@react-navigation/native";
class NavigationService {
    _navigator

    setTopLevelNavigator(ref) {
        window.NavigationService = this;
        this._navigator = ref;
    }

    navigate(routeName, params) {
        this._navigator.current.dispatch(
            CommonActions.navigate({
                name: routeName,
                params: params,
            }),
        );
    }

    back() {
        this._navigator.current.dispatch(CommonActions.goBack());
    }


    reset({ routes, index }) {
        this._navigator.current.dispatch(CommonActions.reset({
            index,
            routes,
        }));
    }
}

export default new NavigationService();
/*
export const NavigationService = {
    navigate,
    setTopLevelNavigator,
    back,
    reset,
    navigator:  this._navigator,
};*/


//window.NavigationService = NavigationService;