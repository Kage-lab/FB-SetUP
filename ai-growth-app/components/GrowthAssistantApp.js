
// 成長アシスタントアプリ：画面遷移・要約・PDF保存・共有対応版
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../components/ui/select";
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GrowthAssistantApp = () => {
  const [language, setLanguage] = useState("ja");
  const [workJoy, setWorkJoy] = useState("");
  const [joyLog, setJoyLog] = useState([]);
  const [step, setStep] = useState(1);
  const summaryRef = useRef();

  const saveWorkJoy = () => {
    if (workJoy.trim()) {
      const timestamp = new Date().toLocaleString();
      setJoyLog(prev => [...prev, `${timestamp}: ${workJoy}`]);
      setWorkJoy("");
      setStep(2);
    }
  };

  const generatePDF = () => {
    if (!summaryRef.current) return;
    html2canvas(summaryRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('GrowthAssistant_Summary.pdf');
      setStep(3);
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {step === 1 && (
        <>
          <Card><CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">🌐 Language / 言語選択</h2>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[150px]">
                  <span>{language === "ja" ? "日本語" : "English"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent></Card>

          <Card><CardContent className="space-y-4">
            <p className="text-sm text-gray-500">🧠 ステップ 1/3：自己探索 - 喜びと達成感の記録</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>どんな場面で、どんなことをしていましたか？</li>
              <li>誰と関わっていましたか？</li>
              <li>どんな結果を得て、どんな気持ちになりましたか？</li>
            </ul>
            <Textarea
              placeholder="例：プロジェクトでメンバーと協力して大きな成果を出せたとき..."
              value={workJoy}
              onChange={e => setWorkJoy(e.target.value)}
              className="min-h-[140px]"
            />
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={saveWorkJoy}>次へ</Button>
          </CardContent></Card>
        </>
      )}

      {step === 2 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-xl font-bold">📋 ステップ 2/3：確認と要約</h2>
          <div ref={summaryRef} className="bg-white border rounded-md p-4 space-y-2">
            {joyLog.map((entry, idx) => (
              <div key={idx} className="text-sm bg-yellow-50 rounded-md p-2 shadow-sm">🌈 {entry}</div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setStep(1)}>戻る</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={generatePDF}>📄 PDFを保存</Button>
          </div>
        </CardContent></Card>
      )}

      {step === 3 && (
        <Card><CardContent className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">✅ ステップ 3/3：完了</h2>
          <p className="text-gray-600">PDFが作成されました。保存・共有・送信が可能です。</p>
          <p className="text-sm text-gray-500">メール添付やSlackでの共有を行ってください。</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setStep(1)}>最初からやり直す</Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default GrowthAssistantApp;
