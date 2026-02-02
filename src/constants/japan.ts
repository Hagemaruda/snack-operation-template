//  定数への設定値

//  constant
export const LABEL = {
    USER_STATUS: {
        FIREBASE_ATUH_NONE:     '未認証',
        FIREbASE_NO_PROVIDER:   '承認未登録',
        NOT_REGISTERD:          'ID登録待ち',
        DISABLED:               '利用資格なし',
        PERMITTED:              'システム利用可能',
    },
    USER_STATUS_NAME: {
        FIREBASE_ATUH_NONE:     '(未認証ユーザ)',
        FIREbASE_NO_PROVIDER:   '(承認未登録)',
        NOT_REGISTERD:          '(ID登録待ち)',
        DISABLED:               '利用資格なし',
        PERMITTED:              'システム利用可能',
    },
    HISTORY: {
        CRUD_CREATE:        '格納',
        CRUD_REFARENCE:     '参照',
        CRUD_UPDATE:        '更新',
        CRUD_DELETE:        '削除',
    },
    ROLES: {
        ADMIN:              '管理者',
        STAFF:              'スタッフ',
        CAST:               'キャスト',
        USER:               '一般(未使用)',
        UNKNOWN:            '未認証',
        GUEST:              'ゲスト',
    },
    AUTH: {
        LOGIN_TYPE_LINK:    '連携',
        LOGIN_TYPE_SIGNIN:  'ログイン',
    },
    TODAY_STATUS: {
        WORKING:            '勤務中',
        WORK_IN:            '出勤申請中',
        WORK_FINISH:        '退勤',
        REST:               '休み',
        PRE_WORK:           '出勤予定あり',
        LATENESS:           '出勤時間超過',
        CANCELED:           '出勤取消',
        WORK_REST:          '休憩中',
    }
} as const;

//  
export const MESSAGE = {
    ISSUE: {
        ID_REGIST_REQUEST: {
            title:          '登録IDの送付',
            message:        'IDの登録をお願いします',
        },
        STSTUS_NOT_REGISTERD: {
            title:          'システム利用登録待ち',
            message:        'IDを管理者に伝えてなければ伝えてください',
        },
        STSTUS_FIREBASE_NO_PROVIDER: {
            title:          '認証未登録',
            message:        '認証方法がないとシステム登録できません<br>認証方法を登録してください',

        },
        STSTUS_DISABLED: {
            title:          'システム利用不可！',
            message:        'システムを利用する資格がありません<br><br>.....log write completed',
        },
        STSTUS_FIREBASE_AUTH_NONE: {
            title:          'ログオフ状態',
            message:        '認証でログインしてください',
        },
    }
} as const;

//  表示用
//  for view
export const DISPLAY = {
    ISSUE: {
        ID_COPY_ALERT:      'LINKをコピーしました\n管理者に連携してください',
        BUTTON_LOGIN:       '既存IDで認証',
        BUTTON_ISSUE_ID:    '仮IDを発行',
        QR_SHOW:            'QRコード表示',
        QR_HIDE:            'QRコード閉じる',
        QR_MESSAGE:         '管理者に読み取ってもらいます',
        BUTTON_LINE:        'IDを連携',
        BUTTON_COPY:        'リンクをコピーする',
        ERROR_NAME_NO_INPUT:'名前を入力してください',
        OPERATION_CANCEL:   'キャンセルしました',
    },
    AUTH: {
        EMAIL_REENTER:      '確認のためメールアドレスを再入力してください',
        LOGOFF_CONFIRM:     'ログオフしますか？',
        LOGOFF_FAILURE:     'ログオフに失敗しました。',
        USER_NOTHING:       'ログイン情報がありません',
        BUTTON_GOOGLE_AUTH: 'Googleで認証',
        BUTTON_MAIL_AUTH:   'メール認証（リンクメール送信）',
        LABEL_AUTH_SELECT:  '認証方法の選択',
        LABEL_AUTH_PROVIDER:'認証方法の追加',
        LABEL_MODE_LOGIN:   'ログイン',
        LINK_COMPLETE:      '連携が完了しました',
        LOGIN_COMPLETE:     'ログインしました',
        MAIL_SEND_COMPLETE: '認証メールを送信しました',
        ICON_AUTH_CLOSE:    '▶︎',
        ICON_AUTH_OPEN:     '▼',
        ERROR_UNKNOWN:              'エラーが発生しました',
        ERROR_INVALID_EMAIL:        'メールアドレスの形式が正しくありません',
        ERROR_NETWORK_REQUEST_FAILED:   'ネットワークエラーが発生しました。接続を確認してください',
        ERROR_USER_CANCELLED:       '認証がキャンセルされました',
        ERROR_TOO_MANY_ATTEMPTS_TRY_LATER:
                                    '短時間に何度も試行したためブロックされました\n後ほど再試行してください',
        ERROR_EMAIL_EMPTY:          'メールアドレスを入力してください',
        ERROR_POPUP_CLOSED_BY_USER: 'キャンセルしました',
        LOG_WRITE_FAILUER:  'ログの出力に失敗しました',
    },
    SHOP_NAME_NOTHING:      '(店舗名称設定)',
    UNKNOWN_USER_NAME:      '未承認ユーザ',
} as const;