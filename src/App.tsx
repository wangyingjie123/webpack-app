import { useState } from 'react';
import { ConfigProvider, DatePicker, message } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import type { Dayjs } from 'dayjs';
import styles from './index.module.scss';

dayjs.locale('zh-cn');

function App() {
  const [date, setDate] = useState<Dayjs | null>(null);
  const handleChange = (value: Dayjs | null) => {
    message.info(`您选择的日期是: ${value ? value.format('YYYY年MM月DD日') : '未选择'}`);
    setDate(value);
  };
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.app}>
        <DatePicker onChange={handleChange} />
        <div style={{ marginTop: 16 }}>当前日期：{date ? date.format('YYYY年MM月DD日') : '未选择'}</div>
      </div>
    </ConfigProvider>
  );
}
export default App;
