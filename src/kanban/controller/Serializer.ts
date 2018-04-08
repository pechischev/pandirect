import IStorableState from '../storage/IStorableState';
import List from '../model/List';
import Card from '../model/Card';
import User from '../model/User';

class Serializer {
    private _data: Array<any>;

    constructor() {

        this._data = [];
    }

    init() {
        const data = this._getDataFromLocaleStorage();
        if (!data)
        {
            localStorage.setItem("trello", JSON.stringify([]));
        }
    }

    save(state: IStorableState) {
        if (state.error || !state.user)
        {
            return;
        }
        const data = this._getDataFromLocaleStorage();
        const storageData = {
            user: this._serializeUser(state.user),
            lists: this._serializeLists(state.lists)
        };

        const currentUser = data.find((dataItem: any) => (dataItem.user.email === storageData.user.email));
        if (!currentUser)
        {
            data.push(storageData);
        }
        else
        {
            currentUser.lists = storageData.lists;
        }

        localStorage.setItem("trello", JSON.stringify(data));
    }

    private _serializeUser(user: User): any {
        return {
            email: user.email(),
            password: user.password()
        };
    }

    private _serializeLists(lists: Array<List>): any[] {
        const listsJson = [];
        for (const list of lists)
        {
            const json = {
                id: list.id(),
                title: list.title(),
                cards: this._serializeCards(list.cards())
            };

            listsJson.push(json);
        }
        return listsJson;
    }

    private _serializeCards(cards: Array<Card>): any[] {
        const cardsJson = [];
        for (const card of cards)
        {
            const json = {
                id: card.id(),
                title: card.title()
            };
            cardsJson.push(json);
        }
        return cardsJson;
    }

    private _getDataFromLocaleStorage(): any {
        return JSON.parse(localStorage.getItem("trello"));
    }
}

export default Serializer;