<template>
    <div class="wrapper">
        <div class="modal" @click="setModal" v-show="modal">
            <div class="modal__alert">
                <div v-show="modalInfo" class="modal__info">
                    <div>
                        <span class="modal__date">Дата создания:</span>
                        <span>{{ creationDate }}</span>
                    </div>
                    <div>
                        <span class="modal__date">Дата редактирования:</span>
                        <span>{{ editDate }}</span>
                    </div>
                </div>
                <div v-show="modalRemove" class="modal__remove">
                    <div class="modal__prompt">Удалить заметку?</div>
                    <div class="modal__options">
                        <div class="modal__btn">Отмена</div>
                        <div @click="removeNote" class="modal__btn">
                            Удалить
                        </div>
                    </div>
                </div>
                <div @click.stop v-show="modalCreate" class="modal__create">
                    <div class="modal__create-input">
                        <input
                            ref="listInput"
                            placeholder="Название"
                            v-model="listName"
                        />
                    </div>
                    <div @click="saveList" class="modal__save">Сохранить</div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="note-page">
                <div class="note-page__menu">
                    <div @click="$router.push('/')" class="note-page__back">
                        <img src="../assets/icons/back.png" alt="" />
                    </div>
                    <div class="note-page__options">
                        <div
                            @click="setImportant"
                            v-show="!important"
                            class="note-page__btn"
                        >
                            <img src="../assets/icons/bookmark.png" alt="" />
                        </div>
                        <div
                            @click="setImportant"
                            v-show="important"
                            class="note-page__btn"
                        >
                            <img
                                src="../assets/icons/bookmark_filled.png"
                                alt=""
                            />
                        </div>
                        <div
                            @click="
                                modalInfo = true;
                                modal = true;
                            "
                            class="note-page__btn"
                        >
                            <img src="../assets/icons/info.png" alt="" />
                        </div>
                        <div
                            @click="
                                modal = true;
                                modalRemove = true;
                            "
                            class="note-page__btn"
                        >
                            <img src="../assets/icons/delete.png" alt="" />
                        </div>
                    </div>
                </div>
                <div class="note-page__title">
                    <input
                        ref="headerInput"
                        v-model="header"
                        type="text"
                        placeholder="Название"
                    />
                </div>
                <div @click="listSwitch" class="note-page__body">
                    <div
                        v-for="(value, name) in note.list"
                        :key="name"
                        class="note-page__item"
                    >
                        <div ref="listLabel" class="note-page__label">
                            <div v-show="value" class="note-page__check">
                                <img
                                    src="../assets/icons/check-mark.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div :class="{ done: value }" class="note-page__list">
                            {{ name }}
                        </div>
                    </div>
                </div>
                <div @click="openListModal" class="note-page__create">
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            modal: false,
            modalInfo: false,
            modalRemove: false,
            modalCreate: false,
            listName: "",
            header: "",
            body: "",
            noteId: this.$route.params.id,
            saveText: "",
            important: false,
            creationDate: "",
            editDate: "",
            isDone: null,
            note: {},
        };
    },
    methods: {
        getNote() {
            this.note = JSON.parse(localStorage.getItem(this.noteId));
            this.header = this.note.header;
            this.important = this.note.important;
            this.editDate = this.note.editDate;
            this.creationDate = this.note.creationDate;
        },
        removeNote() {
            localStorage.removeItem(this.noteId);
            this.$router.push({
                name: "home",
            });
        },
        setModal() {
            if (this.modal) {
                this.modal = false;
                this.modalInfo = false;
                this.modalRemove = false;
                this.modalCreate = false;
            } else {
                this.modal = true;
            }
        },
        openListModal() {
            this.modal = true;
            this.modalCreate = true;
            setTimeout(() => this.$refs.listInput.focus(), 0);
        },
        saveList() {
            if (this.listName) {
                this.note.list[this.listName] = false;
                this.editDate = new Date().toLocaleDateString("ru", {
                    hour: "numeric",
                    minute: "numeric",
                });
                this.note.editDate = this.editDate;
                localStorage.setItem(this.noteId, JSON.stringify(this.note));
                this.modal = false;
                this.modalCreate = false;
                this.listName = "";
            }
        },
        listSwitch(e) {
            if (e.target.classList.contains("note-page__item")) {
                let listText =
                    e.target.querySelector(".note-page__list").textContent;
                this.note.list[listText] = !this.note.list[listText];
                this.editDate = new Date().toLocaleDateString("ru", {
                    hour: "numeric",
                    minute: "numeric",
                });
                this.note.editDate = this.editDate;
                localStorage.setItem(this.noteId, JSON.stringify(this.note));
            } else if (e.target.closest(".note-page__item")) {
                let listItem = e.target.closest(".note-page__item");
                let listText =
                    listItem.querySelector(".note-page__list").textContent;
                this.note.list[listText] = !this.note.list[listText];
                this.editDate = new Date().toLocaleDateString("ru", {
                    hour: "numeric",
                    minute: "numeric",
                });
                this.note.editDate = this.editDate;
                localStorage.setItem(this.noteId, JSON.stringify(this.note));
            }
        },
        setImportant() {
            this.important = !this.important;
            this.note.important = this.important;
            this.editDate = new Date().toLocaleDateString("ru", {
                hour: "numeric",
                minute: "numeric",
            });
            this.note.editDate = this.editDate;
            localStorage.setItem(this.noteId, JSON.stringify(this.note));
        },
    },
    mounted() {
        this.getNote(this.newList);
    },
};
</script>

<style scoped lang="scss">
.wrapper {
    background-color: lightgoldenrodyellow;
    min-height: 100vh;
    position: relative;
}

.container {
    min-height: inherit;
}

.done {
    text-decoration: line-through;
}

.modal {
    &__info {
        background-color: lightgoldenrodyellow;
        padding: 15px;
        text-align: center;
        :first-child {
            margin-bottom: 10px;
        }
    }
    &__date {
        color: rgb(97, 64, 27);
        font-weight: 600;
        margin-right: 5px;
    }
    &__remove {
        background-color: lightgoldenrodyellow;
        padding: 15px;
        text-align: center;
    }
    &__prompt {
        color: rgb(97, 64, 27);
        font-weight: 600;
    }
    &__options {
        display: flex;
        margin-top: 20px;
        justify-content: center;
        :first-child {
            margin-right: 20px;
        }
    }
    &__btn {
        color: #fff;
        background-color: rgb(97, 64, 27);
        padding: 5px 15px;
        border-radius: 12px;
        cursor: pointer;
    }
    &__create {
        background-color: lightgoldenrodyellow;
        padding: 15px;
        align-items: center;
        justify-content: center;
    }
    &__create-input {
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

.note-page {
    position: relative;
    padding-top: 15px;
    min-height: inherit;
    &__create {
        height: 45px;
        width: 45px;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        :first-child {
            height: 65%;
            width: 2px;
            background-color: rgb(97, 64, 27);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        :last-child {
            height: 2px;
            width: 65%;
            background-color: rgb(97, 64, 27);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    &__menu {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
    }
    &__back {
        top: 18px;
        cursor: pointer;
        img {
            width: 28px;
            height: 28px;
        }
    }
    &__options {
        display: flex;
        align-items: center;
        max-width: 110px;
        width: 100%;
        justify-content: space-between;
    }
    &__btn {
        cursor: pointer;
        img {
            width: 28px;
            height: 28px;
        }
    }
    &__title {
        display: flex;
        justify-content: center;
        input {
            border: none;
            background-color: transparent;
            font-size: 24px;
            font-weight: 600;
            max-width: 300px;
            width: 100%;
            text-align: center;
        }
    }
    &__item {
        display: flex;
        align-items: center;
        padding: 5px 0;
        cursor: pointer;
    }
    &__list {
        font-size: 16px;
    }
    &__label {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid rgb(97, 64, 27);
        margin-right: 8px;
        position: relative;
    }
    &__check {
        position: absolute;
        left: 60%;
        top: 60%;
        transform: translate(-50%, -50%);
        img {
            width: 16px;
            height: 16px;
        }
    }
}
</style>