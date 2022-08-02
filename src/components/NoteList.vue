<template>
    <div class="wrapper">
        <div v-show="modal" @click="setModal" class="modal">
            <div class="modal__alert">
                <div v-show="!modalList" class="modal__main">
                    <div class="modal__option" @click="setNote">Заметка</div>
                    <div class="modal__option" @click.stop="openListModal">
                        Список
                    </div>
                </div>
                <div @click.stop v-show="modalList" class="modal__list">
                    <div class="modal__list-input">
                        <input
                            ref="listInput"
                            type="text"
                            placeholder="Название"
                            v-model="header"
                        />
                    </div>
                    <div @click="saveList" class="modal__save">Сохранить</div>
                </div>
            </div>
        </div>
        <div class="nav">
            <div class="container">
                <div class="nav__block" ref="input">
                    <div class="nav__head">
                        <h1 class="nav__header">Заметки</h1>
                        <div class="nav__menu"></div>
                    </div>
                    <div class="nav__search">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Поиск"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="note">
            <div class="container">
                <div class="note__list">
                    <div @click="setModal" class="note__create-btn">
                        <div class="note__plus"><span></span><span></span></div>
                    </div>
                    <transition-group name="notes-list">
                        <div
                            class="note__item"
                            v-for="note in searchedNotes"
                            :key="note.id"
                            @click="openNote(note)"
                        >
                            <div v-show="note.important" class="note__mark">
                                <img
                                    src="../assets/icons/bookmark_filled.png"
                                    alt=""
                                />
                            </div>
                            <div class="note__name">
                                {{ note.header }}
                            </div>
                            <div v-show="note.isList" class="note__check">
                                <img src="../assets/icons/check.png" alt="" />
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
    data() {
        return {
            notes: [],
            modal: false,
            modalList: false,
            header: "",
            searchQuery: "",
        };
    },
    methods: {
        ...mapMutations({
            setNewNote: "note/setNewNote",
            unsetNewNote: "note/unsetNewNote",
        }),
        setStorageKeys() {
            let keys = Object.keys(localStorage);
            for (let key of keys) {
                let note = JSON.parse(localStorage.getItem(key));
                this.notes.push(note);
            }
        },
        setNote() {
            this.setNewNote();
            this.$router.push({
                name: "note",
                params: {
                    id: Date.now(),
                },
            });
        },
        setModal() {
            if (this.modal) {
                this.modal = false;
                this.modalList = false;
            } else {
                this.modal = true;
            }
        },
        openListModal() {
            this.modalList = true;
            setTimeout(() => this.$refs.listInput.focus(), 0);
        },
        saveList() {
            if (this.header) {
                let newList = {
                    id: Date.now(),
                    header: this.header,
                    creationDate: new Date().toLocaleDateString("ru", {
                        hour: "numeric",
                        minute: "numeric",
                    }),
                    editDate: new Date().toLocaleDateString("ru", {
                        hour: "numeric",
                        minute: "numeric",
                    }),
                    important: false,
                    isList: true,
                    list: {},
                };
                localStorage.setItem(newList.id, JSON.stringify(newList));
                this.$router.push({
                    name: "list",
                    params: {
                        id: newList.id,
                    },
                });
            }
        },
        openNote(note) {
            if (note.isList) {
                this.$router.push({
                    name: "list",
                    params: {
                        id: note.id,
                    },
                });
            } else {
                this.$router.push({
                    name: "note",
                    params: {
                        id: note.id,
                    },
                });
            }
        },
    },
    computed: {
        ...mapState({
            newNote: (state) => state.note.newNote,
        }),
        sortedNotes() {
            return [...this.notes].sort((a, b) => {
                if (a.important == b.important) {
                    return a.header?.localeCompare(b.header);
                } else {
                    return b.important - a.important;
                }
            });
        },
        searchedNotes() {
            return this.sortedNotes.filter((note) => {
                return note.header
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase());
            });
        },
    },
    mounted() {
        this.setStorageKeys();
        this.unsetNewNote();
    },
};
</script>

<style scoped lang="scss">
.wrapper {
    position: relative;
}
.container {
    min-height: inherit;
}

.notes-list-move {
    transition: transform 0.8s ease;
}

.modal {
    &__option {
        color: #fff;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: rgb(97, 61, 14);
    }
    &__list {
        background-color: lightgoldenrodyellow;
        padding: 15px;
        align-items: center;
        justify-content: center;
    }
    &__list-input {
        margin-bottom: 10px;
        height: 30px;
        input {
            width: 100%;
            height: 100%;
            border: none;
            border-bottom: 1px solid rgb(97, 64, 27);
        }
    }
    &__save {
        background-color: rgb(97, 64, 27);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0 10px 0;
        cursor: pointer;
        color: #fff;
    }
}
.nav {
    background-color: rgb(97, 64, 27);
    &__head {
        position: relative;
    }
    &__header {
        text-align: center;
        padding-top: 10px;
        font-size: 30px;
        color: white;
    }
    &__search {
        display: flex;
        justify-content: center;
        input {
            width: 80%;
            margin: 15px 0;
            border-radius: 20px;
            border: none;
            height: 35px;
            padding: 5px 15px;
            color: black;
            font-size: 16px;
        }
    }
}
.note {
    background-color: lightgoldenrodyellow;
    min-height: calc(100vh - 116px);
    &__list {
        min-height: inherit;
        padding-top: 20px;
    }
    &__create-btn {
        border-radius: 50%;
        height: 45px;
        width: 45px;
        background-color: rgb(97, 64, 27);
        position: sticky;
        top: 75vh;
        cursor: pointer;
        z-index: 1;
        margin-left: auto;
    }
    &__name {
        font-size: 18px;
        font-weight: 600;
    }
    &__plus {
        & span:first-child {
            height: 65%;
            width: 2px;
            background-color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        & span:last-child {
            height: 2px;
            width: 65%;
            background-color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    &__item {
        height: 60px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid goldenrod;
        cursor: pointer;
        position: relative;
    }
    &__check {
        margin-left: 12px;
        width: 20px;
        height: 20px;
        img {
            width: 20px;
            height: 20px;
        }
    }
    &__mark {
        position: absolute;
        right: 0;
        top: 5px;
        img {
            width: 32px;
            height: 32px;
        }
    }
    &__options {
        display: flex;
        height: 100%;
        align-items: center;
    }
    &__btn {
        width: 100px;
        color: #fff;
        height: 65%;
        border-radius: 12px;
        padding: 10px 5px;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        background-color: rgb(97, 64, 27);
        &:last-child {
            margin-left: 20px;
        }
    }
}
</style>