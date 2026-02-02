/*
    テキストメッセージ表示
      タイトル・メッセージの構造でメッセージを表示する
*/

interface messageViewProps {
  message: {
    title: string;
    message: string;
  }
}

export default function MessageView( { message } : messageViewProps ){
  return (
    <>
      <h1 style={titleStyle}>{ message.title }</h1>
      <p style={descriptionStyle}>
        <span dangerouslySetInnerHTML={{ __html: message.message }} />
      </p>
    </>
  );
}

const titleStyle = { 
  fontSize: "22px", 
  color: "#000", 
  fontWeight: "bold" as const,
  marginBottom: "16px"
};

const descriptionStyle = { 
  fontSize: "14px", 
  color: "#333", 
  marginBottom: "24px",
  lineHeight: "1.6"
};