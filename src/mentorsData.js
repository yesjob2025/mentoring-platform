// src/mentorsData.js (기존 데이터 생성 로직 하단에 추가)

const generateMentors = () => {
  const mentors = [];
  const industries = ["IT/소프트웨어", "반도체/제조", "금융/핀테크", "바이오", "마케팅", "커머스"];
  const companies = {
    "IT/소프트웨어": ["네이버", "카카오", "구글", "토스", "라인"],
    "반도체/제조": ["삼성전자", "SK하이닉스", "현대자동차", "LG엔솔"],
    "금융/핀테크": ["국민은행", "신한은행", "카카오뱅크", "업비트"],
    "바이오": ["셀트리온", "삼성바이오", "유한양행"],
    "마케팅": ["제일기획", "HS애드", "에코마케팅"],
    "커머스": ["쿠팡", "무신사", "배달의민족", "컬리"]
  };
  const jobs = ["개발자", "기획자", "엔지니어", "디자이너", "데이터분석가", "마케터"];
  const majors = ["컴퓨터공학", "전자공학", "경영학", "산업디자인", "통계학", "생명공학"];
  const names = ["김현준", "이서연", "박도윤", "최지우", "정지후", "한수아", "조준서", "임하윤"];

  for (let i = 1; i <= 100; i++) {
    const industry = industries[i % industries.length];
    const companyList = companies[industry];
    const company = companyList[i % companyList.length];
    
    mentors.push({
      id: i,
      name: names[i % names.length] + i,
      industry,
      company,
      job: jobs[i % jobs.length],
      major: majors[i % majors.length],
      img: `https://i.pravatar.cc/150?u=mentor${i}`,
      info: `${industry} 분야 재직 중인 멘토입니다.`,
      commonQA: [{ q: "역량?", a: "기초 지식입니다." }]
    });
  }
  return mentors;
};

export const mentorsData = generateMentors();

// 필터 메뉴 구성을 위한 고유 목록 추출
export const filterCategories = {
  industries: ["IT/소프트웨어", "반도체/제조", "금융/핀테크", "바이오", "마케팅", "커머스"],
  jobs: ["개발자", "기획자", "엔지니어", "디자이너", "데이터분석가", "마케터"],
  majors: ["컴퓨터공학", "전자공학", "경영학", "산업디자인", "통계학", "생명공학"]
};