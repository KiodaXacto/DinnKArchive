import { AsyncStorage } from 'react-native';
import { types, flow } from 'mobx-state-tree';

import { userApi, baseApi, loginApi } from '../api/API';
import NavigationService from '../api/NavigationService';

import { sexe, pays, typeCoursier, role } from "./types"




export const GlobalData = types
    .model('GlobalData', {
        sexes: types.optional(types.array(sexe), []),
        contries: types.optional(types.array(pays), []),
        carrierTypes: types.optional(types.array(typeCoursier), []),
        roles: types.optional(types.array(role), []),
        loaded: false,
    }).actions(self => ({
        setup: flow(function* () {
            if (this.loaded) { return; }
            try {
                yield self.getSexes();
                yield self.getContries();
                yield self.getCarrierTypes();
                yield self.getRoles();
                this.loaded = true;
            } catch (error) {
                console.log("setup faild: ", error)
            }
        })
        , getRoles: flow(function* () {
            try {
                const res = yield baseApi
                    .url("/api/roles")
                    .get()
                    .json();
                //console.log(res);
                if (res["hydra:member"]) {
                    const resClone = [];
                    res["hydra:member"].forEach(e => {
                        if (e.id != 1 && e.id != 4) resClone.push(e);
                    });
                    self.roles = resClone;
                }
            } catch (error) {
                console.log("roles: ", error)
            }
        })
        , getCarrierTypes: flow(function* () {
            try {
                const res = yield baseApi
                    .url("/api/type_coursiers")
                    .get()
                    .json();
                //console.log(res);
                if (res["hydra:member"]) {
                    self.carrierTypes = res["hydra:member"]
                }
            } catch (error) {
                console.log("carrierTypes: ", error)
            }
        }),
        getContries: flow(function* () {
            try {
                let contries = [];
                let link = "/api/pays";
                do {
                    let res = yield baseApi
                        .url(link)
                        .get()
                        .json();
                    //console.log("pays", res);
                    //console.log("next", res["hydra:view"]["hydra:next"]);
                    link = res["hydra:view"]["hydra:next"];
                    if (res["hydra:member"]) {
                        contries = contries.concat(res["hydra:member"]);
                    }
                } while (link);
                self.contries = contries;
            } catch (error) {
                console.log("contries: ", error)
            }
        }),
        getSexes: flow(function* () {
            try {
                const res = yield baseApi
                    .url("/api/sexes")
                    .get()
                    .json();
                //console.log(res);
                if (res["hydra:member"]) {
                    self.sexes = res["hydra:member"]
                }
            } catch (error) {
                console.log("sexes: ", error)
            }
        })
    }))