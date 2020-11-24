import React, { useState, useEffect, useRef, useContext } from "react";
import { Info } from "../Pages/DateTabs";
import { baseURL } from "../Api";
import { Card, Table, Form, Input, message } from "antd";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import { updateInfo } from '../Api'
import "react-photo-view/dist/index.css";
const EditableContext = React.createContext<any>(null);
const columnsInfo = [
  {
    title: "Bubble Persistance",
    dataIndex: "bubblePersistance",
    editable: true,
    width: 100,
  },
  {
    title: "Burst",
    dataIndex: "burst",
    editable: true,
    width: 100,
  },
  {
    title: "Cluster",
    dataIndex: "cluster",
    editable: true,
    width: 100,
  },
  {
    title: "Valid",
    dataIndex: "valid",
    editable: true,
    width: 100,
  },
  {
    title: "Bubble Handling",
    dataIndex: "bubbleHandling",
    editable: true,
    width: 100,
  },
  {
    title: "Channel Damage",
    dataIndex: "channelDamage",
    editable: true,
    width: 100,
  },
  {
    title: "Note",
    dataIndex: "note",
    editable: true,
    width: 100,
  },
];
const numberFields = ['bubblePersistance',
  'burst',
  'cluster',
  'valid', 'bubbleHandling',
  'channelDamage',]
interface Item {
  bubblePersistance: number;
  burst: number;
  cluster: number;
  valid: number;
}
interface EditableRowProps {
  index: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: (record as any)[dataIndex] });
  };

  const save = async (e: any) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            validator(rule, value) {
              if(!numberFields.includes(dataIndex)){
                return Promise.resolve();
              }
              if (isNaN(parseInt(value))) {
                return Promise.reject(`You should input a valid number`);
              } else {
                return Promise.resolve();
              }
            }
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
            minHeight:30
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function ImageCard({ fileInfo: fileInfoParent, updateImageInfo }: { fileInfo: Info, updateImageInfo: () => void }) {
  const [fileInfo, setFileInfo] = useState<Info>(fileInfoParent);

  useEffect(() => {
    setFileInfo(fileInfoParent);
  }, [fileInfoParent]);
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row: any, col: any) => {
    const id: string = row["_id"];
    const field: string = col["dataIndex"];
    if(numberFields.includes(field)){
      const value: number  = parseInt(row[field]);
      updateInfo(id, field, value).then((res: any) => {
        //updateImageInfo();
        setFileInfo(res?.data?.result);
      }).catch(err => {
        message.error(`Failed to update ${field} of ${fileInfo.fileName}`);
      })
    }else{
      const value: string  = row[field]
      updateInfo(id, field, value).then((res: any) => {
        //updateImageInfo();
        setFileInfo(res?.data?.result);
      }).catch(err => {
        message.error(`Failed to update ${field} of ${fileInfo.fileName}`);
      })
    }

  };

  const columns = columnsInfo.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Info) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: (row: any) => {
          handleSave(row, col);
        },
      }),
    };
  });
  return (
    <Card title={fileInfo.fileName}>
      <PhotoConsumer
        key={fileInfo.path}
        src={`${baseURL}/${fileInfo.path.replace(".tif", ".png")}`}
        intro={fileInfo.fileName}
      >
        <img
          alt={fileInfo.fileName}
          height={120}
          src={`${baseURL}/thumbnail/${fileInfo.path.replace(".tif", ".png")}`}
        ></img>
      </PhotoConsumer>

      <Table
        pagination={false}
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={[fileInfo]}
        columns={columns}
      />
    </Card>
  );
}
