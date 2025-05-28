import { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../components/ui/select";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GrowthAssistantApp = () => {
  const [language, setLanguage] = useState("ja");
  const [step, setStep] = useState(1);
  const [workJoy, setWorkJoy] = useState("");
  const [workChallenge, setWorkChallenge] = useState("");
  const [role, setRole] = useState("");
  const [expectedResults, setExpectedResults] = useState("");
  const [environment, setEnvironment] = useState("");
  const [summary, setSummary] = useState("");
  const summaryRef = useRef();

  const generateSummary = () => {
    const parts = [
      workJoy && `🌈 喜びと達成感: ${workJoy}`,
      workChallenge && `🧱 難しさと課題: ${workChallenge}`,
      role && `🧑‍💼 担当する役割: ${role}`,
      expectedResults && `🎯 期待されている成果: ${expectedResults}`,
      environment && `🏢 職場環境の特徴: ${environment}`
    ];
    setSummary(parts.filter(Boolean).join("\n\n"));
    setStep(5);
  };

  const generatePDF = () => {
    if (!summaryRef.current) return;
    html2canvas(summaryRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("GrowthAssistant_Summary.pdf");
      setStep(6);
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {step === 1 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">🌐 言語選択 / Language</h2>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px]">
              <span>{language === "ja" ? "日本語" : "English"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 text-white" onClick={() => setStep(2)}>開始する</Button>
        </CardContent></Card>
      )}

      {step === 2 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🌈 喜びと達成感を感じる瞬間</h2>
          <Textarea value={workJoy} onChange={e => setWorkJoy(e.target.value)} placeholder="どんな場面で、どんなことをして、どんな気持ちでしたか？" className="min-h-[140px]" />
          <Button className="bg-blue-600 text-white" onClick={() => setStep(3)}>次へ</Button>
        </CardContent></Card>
      )}

      {step === 3 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🧱 難しいと感じていること</h2>
          <Textarea value={workChallenge} onChange={e => setWorkChallenge(e.target.value)} placeholder="どのようなことに困難を感じていますか？" className="min-h-[140px]" />
          <Button className="bg-blue-600 text-white" onClick={() => setStep(4)}>次へ</Button>
        </CardContent></Card>
      )}

      {step === 4 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-xl font-bold">🧑‍💼 役割・期待・職場環境の整理</h2>
          <Input value={role} onChange={e => setRole(e.target.value)} placeholder="現在または直近の役割" />
          <Input value={expectedResults} onChange={e => setExpectedResults(e.target.value)} placeholder="期待されている成果" />
          <Textarea value={environment} onChange={e => setEnvironment(e.target.value)} placeholder="職場環境に関する情報" className="min-h-[80px]" />
          <Button className="bg-blue-600 text-white" onClick={generateSummary}>要約を見る</Button>
        </CardContent></Card>
      )}

      {step === 5 && (
        <Card><CardContent className="space-y-4">
          <h2 className="text-xl font-bold">📋 要約確認</h2>
          <div ref={summaryRef} className="whitespace-pre-wrap bg-white border rounded-md p-4">{summary}</div>
          <div className="flex justify-end space-x-2">
            <Button className="bg-gray-400 text-white" onClick={() => setStep(4)}>戻る</Button>
            <Button className="bg-green-600 text-white" onClick={generatePDF}>📄 PDF出力</Button>
          </div>
        </CardContent></Card>
      )}

      {step === 6 && (
        <Card><CardContent className="space-y-4 text-center">
          <h2 className="text-2xl font-bold">✅ 完了しました</h2>
          <p className="text-gray-600">PDFが保存されました。メール送付・Slack共有などにご活用ください。</p>
          <Button className="bg-indigo-600 text-white" onClick={() => setStep(1)}>はじめに戻る</Button>
        </CardContent></Card>
      )}
    </div>
  );
};

export default GrowthAssistantApp;
