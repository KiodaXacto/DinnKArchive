import { types, getParent, flow, applySnapshot } from 'mobx-state-tree';


import { baseApi, notify, paimentApi } from "../api/API";
//lang
import { strings as lang } from "../lang";
//FireStore
// import * as firebase from 'firebase'
// import 'firebase/firestore';

export const sexe = types.model("sexe", {
    _id: types.identifier,
    id: types.integer,
    libelle: types.string
}).preProcessSnapshot(snap => ({
    ...snap,

    _id: snap["@id"] ? snap["@id"] : `/api/sexes/${snap.id}`
}))

export const pays = types.model("pays", {
    _id: types.identifier,
    idPays: types.integer,
    alpha2: types.maybe(types.string),
    alpha3: types.maybe(types.string),
    libEn: types.maybe(types.string),
    libelle: types.maybe(types.string)
}).preProcessSnapshot(snap => ({
    ...snap,
    _id: snap["@id"] ? snap["@id"] : `/api/pays/${snap.id}`,
    libelle: snap.libFr

}))

export const typeCoursier = types.model("typeCoursier", {
    _id: types.identifier,
    id: types.integer,
    libelle: types.string,

}).preProcessSnapshot(snap => {
    if (!snap) { return snap };
    return {
        ...snap,
        _id: snap["@id"] ? snap["@id"] : `/api/type_coursiers/${snap.id}`
    }
})

export const image = types.model("image", {
    _id: types.identifier,
    id: types.integer,
    imageName: types.string,
    contentUrl: types.string,
}).preProcessSnapshot(snap => {
    if (snap) {
        return {
            ...snap,
            _id: snap["@id"] ? snap["@id"] : `/api/photo_profils/${snap.id}`
        };
    } else {
        return snap;
    }
})

export const role = types.model("role", {
    _id: types.identifier,
    id: types.integer,
    libelle: types.string
}).preProcessSnapshot(snap => ({
    ...snap,
    _id: snap["@id"] ? snap["@id"] : `/api/roles/${snap.id}`,
    libelle: snap.libelle.split("_")[1]
}))

const user = types.model('user', {
    id: types.integer,
    nom: types.string,
    prenom: types.string,
    tokenNotification: types.optional(types.maybeNull(types.string), ""),
});

const statut = types.model("statut", {
    //    "@id": types.identifier,
    id: types.identifier,
    libelle: types.string
}).preProcessSnapshot(snapshot => {
    if (snapshot == "/api/statuts/3") {
        return {
            id: snapshot,
            libelle: "EN LIVRAISON"
        }
    }
    return {
        ...snapshot,
        id: snapshot["@id"]
    }
})
export const order = types.model("order", {
    id: types.maybe(types.identifier),
    origine: types.string,
    destination: types.string,
    createdAt: types.maybe(types.string),
    statut: statut,
    livreur: types.maybeNull(user),
    client: user,
    commentaire: types.maybeNull(types.string),
    canBeUpdated: types.optional(types.boolean, false)
}).preProcessSnapshot(snapshot => {
    return {
        ...snapshot,
        id: snapshot["@id"]
    }
}).actions(self => ({
    deleteOrder: flow(function* () {
        console.log("deleting the order: TODO");//TODO:
        try {
            //TODO: later on cant delete course 
        } catch (error) {
            console.log(error);
        }
    }),
    end: flow(function* (data, tkn) {
        try {
            const res = yield baseApi
                .url(self.id)
                .headers({
                    'Accept': 'application/json',
                    'Content-Type': "application/json"
                })
                .put(data).json()

            if (res && res.statut) {
                if (!res.statut["@id"]) {
                    res.statut["@id"] = data.statut;
                }
                applySnapshot(self, res)
                // const docName = `api_utilisateurs_${self.client.id}`;
                // const notif_tkn = yield self.getUserFirestoreToken(docName);

                //console.log("self.client", self.client.tokenNotification);
                if (self.client?.tokenNotification?.trim() === "") { return }
                //console.log("self.client", self.client.tokenNotification);
                const notiData = {
                    "to": self.client.tokenNotification,
                    "sound": "default",
                    ...lang.clientNotifMessage
                }
                yield self.pushNotifToUser(notiData)
            }
        } catch (error) {
            console.log("edit order error", error);
        }
    }),
    pay: flow(function* (data) {
        try {
            const res = yield paimentApi
                .post({ ...data, course: self.id })
                .json()

            if (res) {
                //console.log(res)
                applySnapshot(self, res.course);
                // const docName = `api_utilisateurs_${self.livreur.id}`;
                // const notif_tkn = yield self.getUserFirestoreToken(docName);

                //console.log(self.livreur?.tokenNotification);
                if (self.livreur?.tokenNotification?.trim() === "") { return }
                //console.log(self.livreur?.tokenNotification);
                const notiData = {
                    "to": self.livreur.tokenNotification,
                    "sound": "default",
                    ...lang.carrierNotifMessage
                }
                yield self.pushNotifToUser(notiData)
            };

        } catch (error) {
            if (error.response) {
                switch(error.response.status){
                    case 500:
                        throw error;
                    case 400:
                        throw {...error, message: lang.expiredCoupon}
                } 
            }
            console.log("paiment: ", error) 
        }
    }),
    checkCoupon: flow(function* (data) {
        try {
            const res = yield baseApi
                .url("/api/discounts")
                .query(data)
                .get()
                .json();
            //TODO: checkCoon
            console.log(data);
            console.log(res);

            return res["hydra:member"]? res["hydra:member"][0]: undefined;
        } catch (error) {
            console.log("checkCoupon: ", res);
        }
    }),
    pushNotifToUser: flow(function* (data) {
        //console.log(data);
        try {
            const send = yield notify
                .url("/send")
                .post(data)
                .json();
            //console.log("notify res:", send);
            if (send.data.status === "ok") {
                const getReceipts = yield notify
                    .url("/getReceipts")
                    .post({
                        ids: [send.data.id]
                    })
                    .json()
                //console.log("getReceipts: ", getReceipts);
            }
        } catch (error) {
            console.log(error);
        }
    }),
    // getUserFirestoreToken: flow(function* (doc) {

    //     try {
    //         const dbh = firebase.firestore();
    //         const res = yield dbh.collection("tokens").doc(doc).get();
    //         return res.data();
    //     } catch (error) {
    //         console.log("Firestore: ", error);
    //         return null;
    //     }
    // })
}));
const query = types.model("query", {
    client: types.maybe(types.integer),
    livreur: types.maybe(types.integer),
})
export const orders = types.model('orders', {
    orders: types.optional(types.array(order), []),
    nextPage: types.maybe(types.integer),
    total: types.maybe(types.integer),
    query: types.maybe(query),
}).views(self => ({
    get isEmpty() {
        return self.orders.length === 0;
    },
    get length() {
        return self.orders.length;
    },
    get hasMore (){
        return self.nextPage != undefined;
    }

})).actions(self => ({
    createOrder: flow(function* (data) {
        try {
            console.log(data);
            const res = yield baseApi
                .url('/api/courses')
                //      .auth(`Bearer ${self.auth.authToken}`)
                .post({ ...data })
                .json();

            if (res?.id) {
                const ord = order.create({
                    ...res,
                });
                self.orders.push(ord);
                return ord;
            }
        } catch (error) {
            throw error;
        }
    }),
    get: flow(function* (data) {
        const res = yield baseApi
            .url("/api/courses")
            .query(data)
            .get()
            .json();
        if (res["hydra:member"]) {
            if (data.page) {
                let orders = self.orders.slice();
                //      orders.reverse();
                orders = orders.concat(res["hydra:member"]);
                self.orders = orders;//.reverse();
            } else {
                self.orders = res["hydra:member"];
            }

            const details =res["hydra:view"] 
            self.total = res["hydra:totalItems"];
            const next = details["hydra:next"]; 
            self.nextPage = next ? Number.parseInt(next.split("=").pop()) : undefined;
            console.log("total: ", self.total);
            self.query = data;
        }
    }),
    getNext: flow(function* () {
        try {
            console.log("next page: ", self.nextPage)
            if (!self.nextPage) { return };
            yield self.get({
                ...self.query,
                page: self.nextPage,
            });
        } catch (error) {
            console.log("getNext :", error);
        }
    })
}));
export const UserInfo = types.model('UserInfo', {
    _id: types.identifier,
    id: types.integer,
    nom: types.string,
    prenom: types.string,
    raisonSociale: types.maybeNull(types.string),
    siret: types.maybeNull(types.string),
    siren: types.maybeNull(types.string),
    numeroTel: types.string,
    login: types.string,
    nbCourses: types.maybeNull(types.integer),
    isActive: types.maybeNull(types.boolean),
    sexe: sexe,
    pays: pays,
    typeCoursier: types.maybeNull(typeCoursier),
    image: types.maybeNull(image),
    role: role,
    tokenNotification: types.optional(types.maybeNull(types.string), ""),
    //  orders: types.optional(types.array(order), []),
}).preProcessSnapshot(snap => {
    if (snap) {
        return {
            ...snap,
            _id: `/api/utilisateurs/${snap.id}`
        }
    } else {
        return snap
    }
}).views(self => ({
    get auth() {
        return getParent(self);
    },
    // get ordersIsEmpty() {
    //     return self.orders.length === 0;
    // }

})).actions(self => ({
    // createOrder: flow(function* (data) {
    //     try {
    //         const res = yield baseApi
    //             .url('/api/courses')
    //             //      .auth(`Bearer ${self.auth.authToken}`)
    //             .post({ ...data })
    //             .json();

    //         if (res?.id) {
    //             const ord = order.create({
    //                 ...res,
    //             });
    //             self.orders.push(ord);
    //             return ord;
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }),
    // getUserOrders: flow(function* () {
    //     try {
    //         const userID = self.id;
    //         const role = self.role
    //         const data = {
    //             livreur: role.id === 3 ? userID : undefined,
    //             client: role.id === 2 ? userID : undefined
    //         }

    //         const res = yield baseApi
    //             .url("/api/courses")
    //             //      .auth(`Bearer ${self.auth.authToken}`)
    //             .headers({
    //                 "Cache-Control": "no-cache",
    //             })
    //             .query(data)
    //             .get()
    //             .json();
    //         if (res["hydra:member"]) {
    //             self.orders = res["hydra:member"]
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }),
    updateImage: flow(function* (image) {
        try {
            let error = null;
            if (!image) { console.log("image null"); return; };
            const resImg = yield baseApi
                .url("/api/photo_profils")
                .formData({
                    file: image
                })
                .post()
                .notFound(() => console.log("not Found"))
                .error(400, () => { error = "invalide input" })
                .json()
            console.log(error);
            if (error) { throw error };
            yield self.update({ image: resImg["@id"] });
            if (error) { throw error };
        } catch (error) {
            console.log(error)
        }
    }),
    update: flow(function* (data) {
        try {
            console.log("prenom: ", Object.keys(data))
            const res = yield baseApi
                .url(self._id)
                .put({ ...data })
                .notFound(() => console.log("not Found"))
                .error(400, () => { error = "invalide input" })
                .json();
            applySnapshot(self, res);
        } catch (error) {
            throw error;
        }
    }),
    checkLogin: flow(function* (pass) {
        let status = 200;
        const tkn = yield baseApi
            .url("/login_check")
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            .post({
                username: self.login,
                password: pass
            })
            .unauthorized((er) => {
                console.log(er.status);
                status = er.status
            })
            .json();
        if (status != 200) {
            throw { message: `wrong password !!` };
        }

    }),
    setID: flow(function* () {
        console.log("here we are");
    })

}));






