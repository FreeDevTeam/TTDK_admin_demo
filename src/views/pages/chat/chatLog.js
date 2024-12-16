// ** React Imports
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import Service from "../../../services/request";
import { useDispatch } from "react-redux";
import {
    deleteChatLogById,
    getUserProfile,
    selectChat,
    sendMsg,
} from "../../../redux/actions/chat/index";

import Avatar from "@components/avatar";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MessageSquare, Menu, Image, Send, X, MoreVertical, Archive, Trash2 } from "react-feather";
import {
    Form,
    Label,
    InputGroup,
    InputGroupAddon,
    Input,
    InputGroupText,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { getUserData } from "@utils";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import appUserConversation from "../../../services/appUserConversation";
import ModalDeleteSupportChat from "../../components/modal/ModalDeleteSupportChat"
import { injectIntl } from 'react-intl';
const ChatLog = ({ intl, handleSidebar, store, getChatContacts }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const history = useHistory();
    const { userProfile, selectedUser } = store;
    const [uploadUrl, setUploadUrl] = useState(null);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [selectedChatLogId, setSelectedChatLogId] = useState(null);
    const userData = getUserData();

    const chatArea = useRef(null);
    const dispatch = useDispatch();

    const [msg, setMsg] = useState("");

    const scrollToBottom = () => {
        const chatContainer = ReactDOM.findDOMNode(chatArea.current);
        if (chatContainer) {
            chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
        }
    };

    useEffect(() => {
        const selectedUserLen = Object.keys(selectedUser).length;
        if (selectedUserLen) {
            scrollToBottom();
        }
    }, [selectedUser]);

    const userId = selectedUser?.conversation?.appUserId;
    useEffect(() => {
        let timer;
        if (selectedUser?.conversation?.appUserConversationId) {
            dispatch(getUserProfile(userId));
            timer = setInterval(() => {
                dispatch(selectChat(selectedUser?.conversation));
            }, 10000);
        }

        return () => {
            clearInterval(timer);
        };
    }, [selectedUser?.conversation?.appUserConversationId]);

    const handleDeleteChatItem = (id) => {
        setSelectedChatLogId(id)
        setIsOpenModalDelete(true)
    }

    const renderChats = useMemo(() => {
        const reverseList = selectedUser?.chat?.slice?.()?.reverse?.() || [];
        return reverseList.map((item, index) => {
            const isUser = item?.senderToReceiver === 0;
            return (
                <div
                    key={index}
                    className={classnames("chat", {
                        "chat-left": isUser,
                    })}
                >
                    <div className={`chat-body mb-2 ${!isUser ? 'd-flex align-items-center justify-content-end chat-body__has-icon' : ''}`}>
                        {
                            !isUser && <Button color={'transparent'} className={'p-0 mr-50'} onClick={() => handleDeleteChatItem(item?.appUserChatLogId)}><Trash2 /></Button>
                        }
                        <div className="chat-content mb-0">
                            <span
                                className="text"
                                dangerouslySetInnerHTML={{
                                    __html: item?.appUserChatLogContent,
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        });
    }, [selectedUser?.chat?.length]);

    const handleStartConversation = () => {
        if (!Object.keys(selectedUser.conversation).length) {
            dispatch(selectChat(store?.chats?.data?.[0]));
        }
    };

    const handleUploadImage = (e) => {
        const reader = new FileReader();
        const files = e.target.files;
        if (!files.length) return;

        const file = files[0];
        if (file.size > 10048576) {
            toast.warn(intl.formatMessage({ id: "big_size" }));
            return;
        }
        reader.readAsDataURL(files[0]);
        reader.onload = function () {
            let baseString = reader.result;
            const params = {
                imageData: baseString.replace("data:" + file.type + ";base64,", ""),
                imageFormat: file.type.replace("image/", ""),
            };
            appUserConversation
                .uploadImage(params)
                .then((result) => {
                    setUploadUrl(result);
                })
                .catch((error) => {
                    toast.error(intl.formatMessage({ id: "error" }));
                })
                .finally(() => {
                    e.target.value = "";
                });
        };
        reader.onerror = function (error) {
            toast.error(intl.formatMessage({ id: "error" }));
        };
    };

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (uploadUrl) {
            const contentHtml = `<div className="msg-text owner uploaded-file">
        <img src="${uploadUrl}"  alt="" />
      </div>`;
            dispatch(
                sendMsg({
                    appUserChatLogContent: contentHtml,
                    appUserConversationId:
                        selectedUser?.conversation?.appUserConversationId,
                    createdAt: new Date().toISOString(),
                    isDeleted: 0,
                    isHidden: 0,
                    receiverId: selectedUser?.conversation?.receiverId,
                    senderId: userData?.staffId,
                })
            );
            setUploadUrl(null);
        }
        if (msg.length) {
            dispatch(
                sendMsg({
                    appUserChatLogContent: msg,
                    appUserConversationId:
                    selectedUser?.conversation?.appUserConversationId,
                    createdAt: new Date().toISOString(),
                    isDeleted: 0,
                    isHidden: 0,
                    receiverId: selectedUser?.conversation?.receiverId,
                    senderId: userData?.staffId,
                })
            );
            setMsg("");
        }
    };

    const ChatWrapper =
        Object.keys(selectedUser).length && selectedUser.chat
            ? PerfectScrollbar
            : "div";


    const handleDeteleChat = () => {
        if (selectedChatLogId) {
            dispatch(deleteChatLogById(selectedChatLogId, selectedUser?.conversation))
            setSelectedChatLogId(null)
        } else {
            Service.send({
                method: "POST",
                path: "AppUserConversation/deleteByID",
                data: { id: searchParams?.get("id") },
                headers: {},
            }).then((res) => {
                if (res) {
                    const { statusCode, message } = res;
                    if (statusCode === 200) {
                        toast.success(intl.formatMessage({ id: "delete_success" }));
                        dispatch(getChatContacts());
                        history.push(`${window.location.pathname}`);
                        window.location.reload();
                    } else {
                        toast.warn(message || intl.formatMessage({ id: "error" }));
                    }
                } else {
                }
            });
        }
    }

    return (
        <div className="chat-app-window">
            <div>
                <div className="start-chat-icon mb-1">
                    <MessageSquare />
                </div>
                <h4
                    className="sidebar-toggle start-chat-text"
                    onClick={handleStartConversation}
                >
                    {intl.formatMessage({ id: "chat" })}
                </h4>
            </div>
         
                <div
                    className={classnames("active-chat", {
                       
                    })}
                >
                    <div className="chat-navbar">
                        <header className="chat-header">
                            <div className="d-flex align-items-center">
                                <div
                                    className="sidebar-toggle d-block d-lg-none mr-1"
                                    onClick={handleSidebar}
                                >
                                    <Menu size={21} />
                                </div>
                                <Avatar
                                    imgHeight="36"
                                    imgWidth="36"
                                    img={userProfile?.userAvatar}
                                    status="online"
                                    className="avatar-border user-profile-toggle m-0 mr-1"
                                />
                                <h6 className="mb-0">
                                    {userProfile?.firstName || userProfile?.lastName
                                        ? [userProfile?.firstName, userProfile?.lastName].join(" ")
                                        : userProfile?.username}
                                </h6>
                            </div>
                            <div className="d-flex align-items-center">
                                <UncontrolledDropdown>
                                    <DropdownToggle tag="div" className="btn btn-sm">
                                        <MoreVertical size={20} className="cursor-pointer" />
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem
                                            onClick={() => {
                                                setIsOpenModalDelete(true);
                                            }}
                                            className="w-100"
                                        >
                                            <Archive size={14} className="mr-50" />
                                            <span className="align-middle">Xoá</span>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </header>
                    </div>
                    <ChatWrapper
                        ref={chatArea}
                        className="user-chats"
                        options={{ wheelPropagation: false }}
                    >
                        {selectedUser?.chat ? (
                            <div className="chats">{renderChats}</div>
                        ) : null}
                    </ChatWrapper>

                    <Form
                        className="chat-app-form"
                        style={{ position: "relative" }}
                        onSubmit={(e) => handleSendMsg(e)}
                    >
                        {uploadUrl && (
                            <div
                                style={{ position: "absolute", left: 0, top: "-100px" }}
                                className="w-100 bg-white p-1"
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        height: 80,
                                        width: 165,
                                    }}
                                >
                                    <img
                                        src={uploadUrl}
                                        alt=""
                                        height={80}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <div
                                        onClick={() => setUploadUrl(null)}
                                        style={{
                                            borderRadius: "100%",
                                            width: 14,
                                            height: 14,
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-5px",
                                        }}
                                        className="bg-danger text-white d-flex align-items-center justify-content-center cursor-pointer"
                                    >
                                        <X size={12} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <InputGroup className="input-group-merge mr-1 form-send-message">
                            <Input
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Nhập nội dung tin nhắn"
                            />

                            <InputGroupAddon addonType="append">
                                <InputGroupText>
                                    <Label className="attachment-icon mb-0" for="attach-doc">
                                        <Image
                                            className="cursor-pointer text-secondary"
                                            size={14}
                                        />
                                        <input
                                            onChange={handleUploadImage}
                                            type="file"
                                            accept=".jpg, .png, .gif"
                                            id="attach-doc"
                                            hidden
                                        />
                                    </Label>
                                </InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                        <Button className="send" color="primary">
                            <Send size={14} className="d-lg-none" />
                            <span className="d-none d-lg-block">Gửi</span>
                        </Button>
                    </Form>
                </div>
            < ModalDeleteSupportChat
                isOpenModal={isOpenModalDelete}
                setIsOpenModal={setIsOpenModalDelete}
                handleDeteleChat={handleDeteleChat}
            />

        </div>
    )
};

export default injectIntl(ChatLog)
