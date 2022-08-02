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
            </div>
        </div>
        <div class="container">
            <div class="note-page">
                <div class="note-page__menu">
                    <div @click="$router.push('/')" class="note-page__back">
                        <img src="../assets/icons/back.png" alt="" />
                    </div>
                    <div v-show="!newNote" class="note-page__options">
                        <div
                            @click="important = true"
                            v-show="!important"
                            class="note-page__btn"
                        >
                            <img src="../assets/icons/bookmark.png" alt="" />
                        </div>
                        <div
                            @click="important = false"
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
                        placeholder="Название"
                    />
                </div>
                <div class="note-page__body">
                    <textarea placeholder="Текст" v-model="body"></textarea>
                </div>
                <div @click="saveNote(noteId)" class="note-page__save">
                    {{ saveText }}
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
            modal: false,
            modalInfo: false,
            modalRemove: false,
            modalCreation: false,
            header: "",
            body: "",
            noteId: this.$route.params.id,
            saveText: "",
            important: false,
            creationDate: new Date(
                Number(this.$route.params.id)
            ).toLocaleDateString("ru", {
                hour: "numeric",
                minute: "numeric",
            }),
            editDate: "",
        };
    },
    methods: {
        ...mapMutations({
            unsetNewNote: "note/unsetNewNote",
        }),
        setModal() {
            if (this.modal) {
                this.modal = false;
                this.modalInfo = false;
                this.modalRemove = false;
                this.modalCreation = false;
            } else {
                this.modal = true;
            }
        },
        saveNote(id) {
            if (this.header) {
                let newNote = {
                    id: id,
                    header: this.header,
                    body: this.body,
                    creationDate: this.creationDate,
                    editDate: new Date().toLocaleDateString("ru", {
                        hour: "numeric",
                        minute: "numeric",
                    }),
                    important: this.important,
                };
                this.unsetNewNote();
                localStorage.setItem(newNote.id, JSON.stringify(newNote));
                this.$router.push({
                    name: "home",
                });
            }
        },
        getNote() {
            if (!this.newNote) {
                let note = JSON.parse(localStorage.getItem(this.noteId));
                this.header = note.header;
                this.body = note.body;
                this.saveText = "Изменить";
                this.important = note.important;
                this.editDate = note.editDate;
            } else {
                this.saveText = "Сохранить";
                this.$refs.headerInput.focus();
            }
        },
        removeNote() {
            localStorage.removeItem(this.noteId);
            this.$router.push({
                name: "home",
            });
        },
    },
    computed: {
        ...mapState({
            newNote: (state) => state.note.newNote,
        }),
    },
    mounted() {
        this.getNote();
    },
};
</script>

<style scoped lang="scss">
.wrapper {
    background-color: lightgoldenrodyellow;
    min-height: 100vh;
}

.container {
    min-height: inherit;
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
}

.note-page {
    position: relative;
    padding-top: 15px;
    min-height: inherit;
    &__create {
        height: 45px;
        width: 45px;
        position: absolute;
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
    &__body {
        margin-top: 50px;
        width: 100%;
        height: calc(100vh - 195px);
        textarea {
            border: none;
            height: inherit;
            width: inherit;
            background-color: transparent;
            resize: none;
            font-size: 18px;
            padding: 0;
            &:focus-visible {
                outline: none;
            }
        }
    }
    &__save {
        position: absolute;
        left: 0;
        width: 100%;
        background-color: rgb(97, 64, 27);
        height: 50px;
        bottom: 0;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        border-radius: 12px 12px 0 0;
    }
}
</style>