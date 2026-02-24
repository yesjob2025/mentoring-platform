import React, { useState, useMemo } from 'react';
import { mentorsData, filterCategories } from './mentorsData';
import logo from './images/logo.jpg';
import main01 from './images/main01.jpg';

// --- [보조 컴포넌트 1: 추천 카드] ---
const RecommendCard = ({ mentor, onClick }) => (
  <div style={recCardStyle} onClick={() => onClick(mentor)}>
    <img src={mentor.img} alt={mentor.name} style={recImgStyle} />
    <div style={{ textAlign: 'left' }}>
      <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{mentor.name}</div>
      <div style={{ fontSize: '11px', color: '#007bff' }}>{mentor.company}</div>
    </div>
  </div>
);

// --- [보조 컴포넌트 2: 필터 그룹] ---
const FilterGroup = ({ title, options, selected, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <p style={filterLabelStyle}>{title}</p>
    {options.map(opt => (
      <label key={opt} style={checkboxLabelStyle}>
        <input type="checkbox" checked={selected.includes(opt)} onChange={() => onChange(opt)} />
        <span style={{ marginLeft: '8px' }}>{opt}</span>
      </label>
    ))}
  </div>
);

function App() {
  const [page, setPage] = useState('home');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({ industries: [], jobs: [], majors: [] });
  
  // 상세 모달 관련 상태
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isQuestionMode, setIsQuestionMode] = useState(false);
  const [questionText, setQuestionText] = useState("");

  const [userInfo] = useState({ major: "컴퓨터공학", targetJob: "개발자" });

  // 모달 닫기 핸들러
  const closeModal = () => {
    setSelectedMentor(null);
    setIsQuestionMode(false);
    setQuestionText("");
  };

  // --- 멘토 탐색 페이지 컴포넌트 ---
  const MentorsPage = () => {
    const majorRecommended = mentorsData.filter(m => m.major === userInfo.major).slice(0, 3);
    const jobRecommended = mentorsData.filter(m => m.job === userInfo.targetJob).slice(0, 3);
    
    const filtered = useMemo(() => {
      const cleanSearch = searchTerm.trim().toLowerCase().replace(/\s/g, "");
      return mentorsData.filter(m => {
        const indMatch = selectedFilters.industries.length === 0 || selectedFilters.industries.includes(m.industry);
        const jobMatch = selectedFilters.jobs.length === 0 || selectedFilters.jobs.includes(m.job);
        const majMatch = selectedFilters.majors.length === 0 || selectedFilters.majors.includes(m.major);
        const searchPool = (m.name + m.company + m.job + m.major + m.industry).toLowerCase().replace(/\s/g, "");
        const searchMatch = !cleanSearch || searchPool.includes(cleanSearch);
        return indMatch && jobMatch && majMatch && searchMatch;
      });
    }, [searchTerm, selectedFilters]);

    return (
      <div style={subPageContainer}>
        <header style={subHeaderStyle}>
          <button onClick={() => setPage('home')} style={backBtn}>← 홈으로</button>
          <h3 style={{ margin: 0 }}>멘토 탐색</h3>
          <div style={{ width: '60px' }}></div>
        </header>

        <section style={recommendSection}>
          <div style={recommendBlock}>
            <p style={sectionTitle}>🎓 {userInfo.major} 전공 추천</p>
            <div style={recGrid}>{majorRecommended.map(m => <RecommendCard key={m.id} mentor={m} onClick={setSelectedMentor} />)}</div>
          </div>
          <div style={recommendBlock}>
            <p style={sectionTitle}>🎯 {userInfo.targetJob} 직무 추천</p>
            <div style={recGrid}>{jobRecommended.map(m => <RecommendCard key={m.id} mentor={m} onClick={setSelectedMentor} />)}</div>
          </div>
        </section>

        <div style={searchStickyBar}>
          <input style={mainSearchBox} placeholder="기업, 멘토, 직무 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div style={contentLayout}>
          <aside style={filterSidebar}>
            <FilterGroup title="산업" options={filterCategories.industries} selected={selectedFilters.industries} onChange={(v) => handleFilterChange('industries', v)} />
            <FilterGroup title="직무" options={filterCategories.jobs} selected={selectedFilters.jobs} onChange={(v) => handleFilterChange('jobs', v)} />
            <FilterGroup title="전공" options={filterCategories.majors} selected={selectedFilters.majors} onChange={(v) => handleFilterChange('majors', v)} />
          </aside>
          <main style={{ flex: 1 }}>
            <div style={gridStyle}>
              {filtered.map(m => (
                <div key={m.id} style={mentorCardStyle} onClick={() => setSelectedMentor(m)}>
                  <img src={m.img} alt={m.name} style={profileImgStyle} />
                  <div style={industryTagStyle}>{m.industry}</div>
                  <h5 style={{ margin: '8px 0' }}>{m.name} 멘토</h5>
                  <p style={companyTxtStyle}>{m.company}</p>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  };

  const handleFilterChange = (cat, val) => {
    setSelectedFilters(prev => ({
      ...prev, [cat]: prev[cat].includes(val) ? prev[cat].filter(i => i !== val) : [...prev[cat], val]
    }));
  };

  return (
    <>
      {page === 'home' && (
        <div style={homeContainerStyle}>
          <div style={{ ...heroSectionStyle, backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${main01})` }}>
            <img src={logo} alt="로고" style={{ height: '50px', marginBottom: '20px' }} />
            <h1 style={{ color: '#fff' }}>성공적인 커리어의 시작</h1>
            <button style={startBtn} onClick={() => setPage('mentors')}>멘토링 시작하기</button>
          </div>
          <div style={buttonGroupStyle}>
            <div style={mainCardStyle} onClick={() => setPage('mentors')}><div style={iconStyle}>🙋‍♂️</div><h3>멘토에게 질문하기</h3></div>
            <div style={mainCardStyle} onClick={() => setPage('lectures')}><div style={iconStyle}>🎥</div><h3>온라인 특강</h3></div>
            <div style={mainCardStyle} onClick={() => setPage('events')}><div style={iconStyle}>🏆</div><h3>행사 참여 방법</h3></div>
          </div>
        </div>
      )}
      {page === 'mentors' && <MentorsPage />}
      
      {/* --- 상세 모달 (소개 + Q&A + 1:1 질문) --- */}
      {selectedMentor && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <button style={modalCloseX} onClick={closeModal}>✕</button>
            
            {!isQuestionMode ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img src={selectedMentor.img} alt={selectedMentor.name} style={modalProfileImg} />
                  <h2 style={{ margin: '10px 0 5px' }}>{selectedMentor.name} 멘토</h2>
                  <p style={{ color: '#007bff', fontWeight: 'bold' }}>{selectedMentor.company} · {selectedMentor.job}</p>
                </div>

                <div style={sectionBox}>
                  <h4 style={sectionHeader}>📝 멘토 소개</h4>
                  <p style={infoTextStyle}>{selectedMentor.info}</p>
                </div>

                <div style={sectionBox}>
                  <h4 style={sectionHeader}>💬 자주 묻는 질문</h4>
                  {selectedMentor.commonQA.map((qa, i) => (
                    <div key={i} style={qaItemStyle}>
                      <p style={qStyle}>Q. {qa.q}</p>
                      <p style={aStyle}>A. {qa.a}</p>
                    </div>
                  ))}
                </div>

                <button style={primaryBtnStyle} onClick={() => setIsQuestionMode(true)}>1:1 질문하기</button>
              </>
            ) : (
              <>
                <h3>{selectedMentor.name} 멘토에게 질문하기</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                  커리어, 취업, 실무 등 궁금한 점을 자유롭게 남겨주세요.
                </p>
                <textarea 
                  style={textareaStyle} 
                  placeholder="질문 내용을 상세히 입력해주세요 (최소 20자)"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button style={secondaryBtnStyle} onClick={() => setIsQuestionMode(false)}>뒤로가기</button>
                  <button style={primaryBtnStyle} onClick={() => {
                    if(questionText.length < 5) return alert("질문을 조금 더 자세히 입력해주세요.");
                    alert("질문이 전송되었습니다! 멘토의 답변을 기다려주세요.");
                    closeModal();
                  }}>질문 전송</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// --- [추가된 스타일 정의] ---
const modalCloseX = { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#999' };
const modalProfileImg = { width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #eef2ff' };
const sectionBox = { textAlign: 'left', marginBottom: '20px' };
const sectionHeader = { fontSize: '15px', color: '#333', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' };
const infoTextStyle = { fontSize: '14px', color: '#555', lineHeight: '1.6', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' };
const qaItemStyle = { marginBottom: '12px', padding: '10px', backgroundColor: '#eef6ff', borderRadius: '8px' };
const qStyle = { fontSize: '13px', fontWeight: 'bold', color: '#007bff', margin: '0 0 5px' };
const aStyle = { fontSize: '13px', color: '#444', margin: 0 };
const textareaStyle = { width: '100%', height: '150px', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'none' };
const primaryBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const secondaryBtnStyle = { flex: 1, padding: '15px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

// (기존 홈/탐색 스타일은 동일하게 유지)
const homeContainerStyle = { minHeight: '100vh', backgroundColor: '#fff' };
const heroSectionStyle = { height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const startBtn = { padding: '15px 40px', backgroundColor: '#fff', color: '#007bff', borderRadius: '30px', border: 'none', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' };
const buttonGroupStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '-50px auto 40px', padding: '0 20px' };
const mainCardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', cursor: 'pointer', textAlign: 'center' };
const iconStyle = { fontSize: '40px', marginBottom: '10px' };
const subPageContainer = { maxWidth: '1100px', margin: '0 auto', padding: '20px' };
const subHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' };
const backBtn = { border: 'none', background: 'none', color: '#007bff', fontWeight: 'bold', cursor: 'pointer' };
const recommendSection = { display: 'flex', gap: '20px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '20px', marginTop: '20px', flexWrap: 'wrap' };
const recommendBlock = { flex: 1, minWidth: '300px' };
const sectionTitle = { fontSize: '13px', fontWeight: 'bold', color: '#666', marginBottom: '10px' };
const recGrid = { display: 'flex', gap: '10px' };
const recCardStyle = { flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', cursor: 'pointer' };
const recImgStyle = { width: '35px', height: '35px', borderRadius: '50%' };
const searchStickyBar = { position: 'sticky', top: '0', zIndex: 10, backgroundColor: '#fff', padding: '15px 0' };
const mainSearchBox = { width: '100%', padding: '15px 25px', borderRadius: '30px', border: '2px solid #007bff', outline: 'none' };
const contentLayout = { display: 'flex', gap: '20px', marginTop: '10px' };
const filterSidebar = { width: '200px', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #eee', height: 'fit-content' };
const filterLabelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#999', marginBottom: '10px' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', fontSize: '13px', marginBottom: '8px', cursor: 'pointer' };
const resetBtn = { background: 'none', border: 'none', color: '#007bff', fontSize: '12px', cursor: 'pointer' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' };
const mentorCardStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center', cursor: 'pointer', border: '1px solid #f0f0f0' };
const profileImgStyle = { width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' };
const industryTagStyle = { fontSize: '10px', color: '#007bff', backgroundColor: '#eef2ff', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' };
const companyTxtStyle = { fontSize: '13px', fontWeight: 'bold', margin: '5px 0' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '30px', width: '95%', maxWidth: '450px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' };

export default App;