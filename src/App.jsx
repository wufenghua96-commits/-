import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import categories from './portfolioData.json'
import { createPortal } from 'react-dom'

gsap.registerPlugin(ScrollTrigger)

let heroPlayedThisRuntime = false
let openingPlayedThisRuntime = false

const Arrow = ({ diagonal = false }) => <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>

const projects = [
  { id:'neon-museum', index:'01', title:'WA WU AI PLATFORM', cn:'挖物AI平台', tags:['AI 产品','品牌与界面','2025'], tone:'acid', description:'围绕 AI 创作工具的平台体验，完成产品视觉、核心界面与品牌表达的一体化设计。', metrics:['完整产品视觉','核心界面体系','AI 创作体验'], featuredCover:'/projects/woowu-ai/project-cover.jpg' },
  { id:'flux-interface', index:'02', title:'BAIMENG LIFE ARK', cn:'佰孟生命方舟', tags:['品牌设计','生命科技','2025'], tone:'ice', description:'以生命科技与未来生态为核心，建立兼具理性秩序与情感温度的品牌视觉系统。', metrics:['品牌识别系统','多场景延展','视觉内容规范'], featuredCover:'/projects/baimeng-life-ark/project-cover.jpg' },
  { id:'echo-character', index:'03', title:'WOOWU IP VISUAL DESIGN', cn:'挖物IP视觉设计', tags:['品牌 IP','视觉规范','IP SYSTEM'], tone:'violet', description:'围绕挖物品牌角色与应用场景，构建具备识别度、延展性与数字化表达的 IP 视觉系统。', metrics:['角色视觉设定','IP 规范系统','多场景应用延展'], featuredCover:'/projects/woowu-ip/featured-cover.png' },
  { id:'bonfire-game', index:'04', title:'BONFIRE GAME DESIGN', cn:'篝火游戏设计', tags:['游戏全案','两代视觉','IDLE RPG'], tone:'ember', description:'以同一套策略放置玩法为核心，分别构建篝火2的古典奇幻绘本体系与篝火3的现代化视觉迭代。', metrics:['篝火2 · 古典奇幻','篝火3 · 现代迭代','角色 / UI / 实机'], featuredCover:'/projects/bonfire-game/cover-poster.webp' },
]

const baimengCaseImages = [
  { src:'/projects/baimeng-life-ark/content-01.jpg', title:'品牌升级', en:'BRAND UPGRADE' },
  { src:'/projects/baimeng-life-ark/content-02.jpg', title:'导视系统', en:'SIGNAGE SYSTEM' },
  { src:'/projects/baimeng-life-ark/content-03.jpg', title:'宣传页设计', en:'BROCHURE DESIGN' },
  { src:'/projects/baimeng-life-ark/content-04.jpg', title:'画册设计', en:'PUBLICATION DESIGN' },
  { src:'/projects/baimeng-life-ark/content-05.jpg', title:'科普馆 IP 设计', en:'SCIENCE MUSEUM IP' },
  { src:'/projects/baimeng-life-ark/content-06.jpg', title:'科普馆空间设计', en:'EXHIBITION SYSTEM' },
]
const woowuIpCaseImages = Array.from({length:17},(_,offset)=>{const number=offset+2;const label=String(number).padStart(2,'0');return {src:`/projects/woowu-ip/case-${label}.png`,title:`IP 视觉规范 ${label}`,en:`WOOWU IP VISUAL SYSTEM / ${label}`}})
const bonfire2Characters = [
  {src:'/projects/bonfire-game/b2-character-01.webp',name:'暗黑剑客',type:'深渊 / DARK KNIGHT'},
  {src:'/projects/bonfire-game/b2-character-02.webp',name:'灯火小子',type:'法师 / FLAME MAGE'},
  {src:'/projects/bonfire-game/b2-character-03.webp',name:'风精灵',type:'森之子 / WIND SPIRIT'},
  {src:'/projects/bonfire-game/b2-character-04.webp',name:'寒霜守卫',type:'耀光 / FROST GUARD'},
  {src:'/projects/bonfire-game/b2-character-05.webp',name:'精灵刺客',type:'森之子 / ELF ASSASSIN'},
  {src:'/projects/bonfire-game/b2-character-06.webp',name:'精灵游侠',type:'森之子 / ELF RANGER'},
  {src:'/projects/bonfire-game/b2-character-07.webp',name:'魔法树灵',type:'森之子 / TREE SPIRIT'},
  {src:'/projects/bonfire-game/b2-character-08.webp',name:'神圣祭司',type:'耀光 / HOLY PRIEST'},
  {src:'/projects/bonfire-game/b2-character-09.webp',name:'生命女王',type:'耀光 / LIFE QUEEN'},
  {src:'/projects/bonfire-game/b2-character-10.webp',name:'石人守卫',type:'守卫 / STONE GUARD'},
  {src:'/projects/bonfire-game/b2-character-11.webp',name:'烈火骑士',type:'深渊 / BLAZE KNIGHT'},
  {src:'/projects/bonfire-game/b2-character-12.webp',name:'火凤法师',type:'法师 / PHOENIX MAGE'},
]
const bonfire2UiScreens = [
  {src:'/projects/bonfire-game/b2-ui-01.webp',name:'主线地图',type:'MAIN QUEST'},
  {src:'/projects/bonfire-game/b2-ui-02.webp',name:'副本系统',type:'DUNGEON'},
  {src:'/projects/bonfire-game/b2-ui-03.webp',name:'工坊系统',type:'WORKSHOP'},
  {src:'/projects/bonfire-game/b2-ui-04.webp',name:'角色信息',type:'HERO PROFILE'},
  {src:'/projects/bonfire-game/b2-ui-05.webp',name:'开服活动',type:'LAUNCH EVENT'},
  {src:'/projects/bonfire-game/b2-ui-06.webp',name:'商业礼包',type:'OFFER SYSTEM'},
  {src:'/projects/bonfire-game/b2-ui-07.webp',name:'公会列表',type:'GUILD LIST'},
  {src:'/projects/bonfire-game/b2-ui-08.webp',name:'公会成员',type:'GUILD MEMBERS'},
]
const bonfire2Gameplay = [
  {src:'/projects/bonfire-game/b2-gameplay-01.webp',name:'世界探索',type:'WORLD MAP'},
  {src:'/projects/bonfire-game/b2-gameplay-02.webp',name:'策略战斗',type:'TACTICAL COMBAT'},
  {src:'/projects/bonfire-game/b2-gameplay-03.webp',name:'英雄招募',type:'HERO RECRUIT'},
  {src:'/projects/bonfire-game/b2-gameplay-04.webp',name:'挂机收益',type:'IDLE REWARD'},
  {src:'/projects/bonfire-game/b2-gameplay-05.webp',name:'阵容搭配',type:'FORMATION'},
  {src:'/projects/bonfire-game/b2-gameplay-06.webp',name:'英雄成长',type:'PROGRESSION'},
]
const bonfire3Characters = [
  {src:'/projects/bonfire-game/b3-character-01.webp',name:'赤刃追猎者',type:'MODERN HERO 01'},
  {src:'/projects/bonfire-game/b3-character-02.webp',name:'发明家',type:'MODERN HERO 02'},
  {src:'/projects/bonfire-game/b3-character-03.webp',name:'火焰法师',type:'MODERN HERO 03'},
  {src:'/projects/bonfire-game/b3-character-04.webp',name:'火焰枪手',type:'MODERN HERO 04'},
  {src:'/projects/bonfire-game/b3-character-05.webp',name:'机器蝎子',type:'MODERN HERO 05'},
  {src:'/projects/bonfire-game/b3-character-06.webp',name:'乐团指挥家',type:'MODERN HERO 06'},
  {src:'/projects/bonfire-game/b3-character-07.webp',name:'风暴法师',type:'MODERN HERO 07'},
  {src:'/projects/bonfire-game/b3-character-08.webp',name:'后勤医生',type:'MODERN HERO 08'},
]
const bonfire3UiScreens = [
  {src:'/projects/bonfire-game/b3-ui-01.webp',name:'荣誉系统',type:'HONOR SYSTEM'},
  {src:'/projects/bonfire-game/b3-ui-02.webp',name:'挂机波次',type:'IDLE WAVE'},
  {src:'/projects/bonfire-game/b3-ui-03.webp',name:'英雄简介',type:'HERO PROFILE'},
  {src:'/projects/bonfire-game/b3-ui-04.webp',name:'星级强化',type:'STAR UPGRADE'},
  {src:'/projects/bonfire-game/b3-ui-05.webp',name:'自定义荣誉墙',type:'CUSTOM HONOR'},
  {src:'/projects/bonfire-game/b3-ui-06.webp',name:'好友系统',type:'SOCIAL SYSTEM'},
]

const experience = [
  { year:'2022.11—2025.04', role:'设计师', company:'福州佰孟生命科技有限公司', text:'主导品牌 VI 系统升级、小程序 UI 与电商视觉建设，并将 AI 嵌入团队工作流，提升品牌物料迭代与协作效率。' },
  { year:'2025.04—2026.03', role:'UI 设计师', company:'福州艾思派克网络科技有限公司', text:'负责平台 UI 与活动视觉，运用 AIGC 完成叙事和风格探索，统筹三代产品设计并沉淀组件规范。' },
  { year:'2026.03—至今', role:'AI 产品专家', company:'福州完美映像文化传媒有限公司', text:'主导电商 AIGC、视频自动化与挖物 AI 工具从 0 到 1，搭建产品矩阵、交付培训及持续迭代闭环。' },
]

function useRoute(){
  const parse=()=>window.location.pathname.replace(/^\//,'')||'home'
  const [route,setRoute]=useState(parse)
  const homeScrollKey='portfolio-home-scroll-position'
  const restoreHomeScroll=()=>{
    const saved=Number(sessionStorage.getItem(homeScrollKey))
    if(!Number.isFinite(saved)||saved<=0){window.scrollTo({top:0,behavior:'instant'});return}
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:saved,behavior:'instant'})))
  }
  useEffect(()=>{
    const onPop=()=>{
      const nextRoute=parse()
      setRoute(nextRoute)
      if(nextRoute==='home')restoreHomeScroll()
    }
    window.addEventListener('popstate',onPop)
    return()=>window.removeEventListener('popstate',onPop)
  },[])
  const navigate=(path,{restoreHomeScroll:shouldRestoreHomeScroll=false}={})=>{
    const isOpeningDetail=location.pathname==='/'&&(path.startsWith('/project/')||path.startsWith('/archive/'))
    if(isOpeningDetail)sessionStorage.setItem(homeScrollKey,String(window.scrollY))
    window.history.pushState({},'',path)
    setRoute(parse())
    if(path==='/'&&shouldRestoreHomeScroll){restoreHomeScroll();return}
    window.scrollTo({top:0,behavior:'instant'})
  }
  return [route,navigate]
}

function CursorGlow(){
  const glow=useRef(null)
  useEffect(()=>{const move=e=>{glow.current?.style.setProperty('--x',`${e.clientX}px`);glow.current?.style.setProperty('--y',`${e.clientY}px`)};window.addEventListener('pointermove',move);return()=>window.removeEventListener('pointermove',move)},[])
  return <div className="cursor-glow" ref={glow}/>
}

function Header({navigate}){
  const go=id=>{if(location.pathname!=='/'){navigate('/');setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),80)}else document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}
  return <header className="site-header">
    <button className="brand" onClick={()=>navigate('/')} aria-label="返回首页">L<span>IN</span><sup>®</sup></button>
    <nav aria-label="主导航"><button onClick={()=>go('about')}>关于 / ABOUT</button><button onClick={()=>go('featured')}>精选 / WORK</button><button onClick={()=>go('archive')}>作品 / ARCHIVE</button></nav>
    <button className="contact-pill" onClick={()=>go('contact')}>联系我 <span>LET'S TALK</span><i className="status-dot"/></button>
  </header>
}

function Hero(){
  const [time,setTime]=useState('')
  const [shouldPlay]=useState(()=>!heroPlayedThisRuntime)
  const videoRef=useRef(null)
  useEffect(()=>{const tick=()=>setTime(new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()));tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)},[])
  const prepareFrame=()=>{const video=videoRef.current;if(!shouldPlay&&video?.duration){video.currentTime=Math.max(0,video.duration-.08);video.pause()}}
  return <section className="hero" id="top">
    <div className="hero-media" aria-hidden="true"><video ref={videoRef} autoPlay={shouldPlay} muted playsInline preload="auto" onPlay={()=>{heroPlayedThisRuntime=true}} onLoadedMetadata={prepareFrame}><source src="/media/hero-reel.mp4" type="video/mp4"/></video><div className="hero-grain"/></div>
    <div className="hero-topline"><span>个人作品集 / PORTFOLIO 2026</span><span>中国 · {time}</span></div>
    <div className="hero-title-wrap"><p className="eyebrow">视觉设计 × 人工智能 × 动态影像</p><h1 className="portfolio-title"><span>PORTFOLIO</span></h1><div className="hero-caption"><span>✦</span><p><strong>个人作品集</strong><small>PERSONAL PORTFOLIO / SELECTED WORKS</small></p><a href="#featured" aria-label="向下查看作品"><Arrow/></a></div></div>
    <div className="hero-index">向下探索 / SCROLL <span>↓</span></div>
  </section>
}

function About(){return <section className="section about" id="about">
  <div className="section-label"><span>01</span> 个人简介 / PROFILE</div>
  <div className="about-grid"><div className="portrait-card"><div className="portrait-art"><img src="/images/profile-photo.jpg" alt="个人形象照片"/><div className="portrait-halo"/><div className="portrait-head"/><div className="portrait-body"/><span className="portrait-code">个人形象 / SELF 2602</span></div><div className="portrait-meta"><span>接受精选项目合作</span><span>●</span></div></div>
  <div className="about-copy"><p className="kicker">五年视觉领域经验 / VISUAL × AI</p><h2 className="profile-name">吴烽华<small>WU FENGHUA</small></h2><div className="about-text-columns about-intro"><p>拥有 5 年视觉领域工作经验，兼具“设计全链路 + AI 工程化”复合背景，熟悉 LLM 大模型与提示词工程。拥有 3 年 AI 深度应用经验，曾主导电商领域 AI 平台从 0 到 1 落地，精通需求定义、流程抽象与自动化管线设计，专注解决运营场景下的效率瓶颈与规模化痛点。</p><p>热衷 Vibe Coding 开发范式，熟练运用 OpenAI Codex、Cloud Code 等 AI 原生工具进行产品开发，将设计判断、产品思维与工程化执行整合为完整的创新工作流。</p></div><div className="contact-list"><a href="mailto:2602479807@qq.com"><span>邮箱 / EMAIL</span>2602479807@qq.com <Arrow diagonal/></a><a href="tel:17605914754"><span>电话与微信</span>176 0591 4754 <Arrow diagonal/></a></div></div></div>
  <div className="timeline"><div className="timeline-line"/>{experience.map((item,index)=><article className="timeline-item" key={item.year}><div className="timeline-dot" style={{'--brightness':.35+index*.32}}/><span className="timeline-year">{item.year}</span><h3>{item.role}</h3><strong>{item.company}</strong><p>{item.text}</p></article>)}</div>
</section>}

function FolderProject({project,navigate}){
  const card=useRef(null)
  const move=e=>{const rect=card.current.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width-.5,y=(e.clientY-rect.top)/rect.height-.5;card.current.style.setProperty('--rx',`${y*-7}deg`);card.current.style.setProperty('--ry',`${x*9}deg`)}
  const reset=()=>{card.current?.style.setProperty('--rx','0deg');card.current?.style.setProperty('--ry','0deg')}
  return <button className={`folder-project tone-${project.tone} ${project.featuredCover?'has-project-cover':''}`} ref={card} onMouseMove={move} onMouseLeave={reset} onClick={()=>navigate(`/project/${project.id}`)}><div className="folder-stage"><div className="project-sheet">{project.featuredCover?<img src={project.featuredCover} alt={`${project.cn}项目封面`}/>:<><div className="sheet-grid"/><span>{project.index}</span><strong>{project.title}</strong><i>{project.cn}</i><div className="sheet-object"/></>}</div><div className="folder-back"><span>精选项目 / {project.tags[2]}</span></div><div className="folder-front"><div className="folder-tab">项目经历 {project.index}</div><h4 className="folder-project-title">{project.cn}<small>{project.title}</small></h4><div className="folder-info"><div><span>{project.tags[0]}</span><span>{project.tags[1]}</span></div><Arrow diagonal/></div></div></div><div className="project-caption"><h3>{project.title}</h3><span>{project.cn}</span></div></button>
}

function Featured({navigate}){return <section className="section featured" id="featured"><div className="section-label"><span>02</span> 项目经历 / PROJECT EXPERIENCE</div><div className="section-head bilingual-head"><h2>项目经历<small>PROJECT EXPERIENCE</small></h2><p>通过四个代表性项目，呈现我在 AI 产品、生命科技品牌、IP 视觉与游戏设计中的思考与执行。</p></div><div className="folder-grid">{projects.map(project=><FolderProject key={project.id} project={project} navigate={navigate}/>)}</div></section>}

function PortfolioMedia({item,alt,className='',controls=false,preview=false,viewer=false}){
  if(item.type==='video'){
    if(preview)return <span className={`video-card-placeholder ${item.poster?'has-poster':''} ${className}`} aria-label={alt}>{item.poster&&<img src={item.poster} alt="" loading="eager" decoding="async"/>}<b>▶</b><small>{item.name}</small></span>
    return <video className={className} src={item.src} poster={item.poster} aria-label={alt} playsInline preload={viewer?'metadata':'none'} controls={controls||viewer}/>
  }
  return <img className={className} src={preview&&item.thumb?item.thumb:item.src} alt={alt} loading={preview||viewer?'eager':'lazy'} decoding="async"/>
}

function Archive({navigate}){return <section className="archive" id="archive"><div className="archive-inner section"><div className="section-label"><span>03</span> 作品分类 / WORK CATEGORIES</div><div className="archive-head bilingual-head"><h2>作品分类<small>WORK CATEGORIES</small></h2><p>六个方向<br/>持续更新的设计实践</p></div><div className="discipline-grid">{categories.map(category=><button key={category.id} className="discipline-card" style={{'--card-color':category.color}} onClick={()=>navigate(`/archive/${category.id}`)}><div className="discipline-cover"><PortfolioMedia item={category.cover} alt={`${category.zh}封面`} preview/><span>{category.no}</span><i/></div><div className="discipline-body"><span>{category.en}</span><h3>{category.zh}</h3><p>{category.summary}</p><div><b>{category.count}</b><span className="discipline-arrow"><Arrow diagonal/></span></div></div></button>)}</div></div></section>}
function Contact(){
  const wechat='17605914754'
  const [copyState,setCopyState]=useState('idle')
  const copyWechat=async()=>{
    let succeeded=false
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(wechat)
        succeeded=true
      }
    }catch{
      succeeded=false
    }
    if(!succeeded){
      const input=document.createElement('textarea')
      input.value=wechat
      input.setAttribute('readonly','')
      input.style.position='fixed'
      input.style.left='-9999px'
      input.style.top='0'
      document.body.appendChild(input)
      input.focus()
      input.select()
      input.setSelectionRange(0,input.value.length)
      try{succeeded=document.execCommand('copy')}catch{succeeded=false}
      input.remove()
    }
    setCopyState(succeeded?'copied':'failed')
    window.setTimeout(()=>setCopyState('idle'),2200)
  }
  const copyLabel=copyState==='copied'?'微信号已复制 ✓':copyState==='failed'?'复制失败，请手动复制':'一键复制微信号'
  return <footer className="contact" id="contact"><div className="contact-shade"/><div className="contact-thanks"><span>THANK YOU FOR WATCHING</span><h2>谢谢观看</h2><div className="wechat-direction"><svg viewBox="0 0 190 72" aria-hidden="true"><path d="M184 18C146 18 145 56 103 56C72 56 57 36 17 38"/><path d="M31 25L16 38L31 51"/></svg><p>扫一扫添加微信<small>SCAN TO ADD WECHAT</small></p></div></div><div className="contact-footer"><div><span>邮箱 / EMAIL</span><a href="mailto:2602479807@qq.com">2602479807@qq.com</a></div><div><span>电话 / 微信</span><a href="tel:17605914754">176 0591 4754</a></div><div><span>视觉设计师 · AI设计师</span><b>VISUAL × AI DESIGNER</b></div><button className={`contact-copy ${copyState}`} onClick={copyWechat}><span>{copyLabel}</span><strong>{wechat}</strong></button><button className="contact-top" onClick={()=>scrollTo({top:0,behavior:'smooth'})}>返回顶部 ↑</button></div></footer>
}


function OpeningSequence(){
  const [visible,setVisible]=useState(()=>!openingPlayedThisRuntime)
  const root=useRef(null)
  const shouldPlay=useRef(!openingPlayedThisRuntime)
  useLayoutEffect(()=>{
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const page=document.documentElement
    const body=document.body
    const context=gsap.context(()=>{
      const heroTargets=['.hero-topline','.eyebrow','.portfolio-title span','.hero-caption','.hero-index']
      if(reduceMotion){
        openingPlayedThisRuntime=true
        setVisible(false)
        gsap.set(heroTargets,{clearProps:'all'})
        return
      }
      if(!shouldPlay.current){
        gsap.timeline({defaults:{ease:'power4.out'}})
          .from('.hero-media',{scale:1.08,duration:1.8,ease:'power3.out'})
          .from('.site-header',{y:-34,autoAlpha:0,duration:1},0)
          .from('.hero-topline',{y:-18,autoAlpha:0,duration:.9},.16)
          .from('.eyebrow',{y:24,autoAlpha:0,duration:.9},.22)
          .from('.portfolio-title span',{yPercent:115,scaleX:.72,transformOrigin:'left center',autoAlpha:0,duration:1.4,ease:'expo.out'},.26)
          .from('.hero-caption',{y:30,autoAlpha:0,duration:1},.64)
          .from('.hero-index',{x:18,autoAlpha:0,duration:.9},.72)
        return
      }
      openingPlayedThisRuntime=true
      window.scrollTo({top:0,left:0,behavior:'instant'})
      body.style.overflow='hidden'
      page.classList.add('is-opening')
      const timeline=gsap.timeline({
        defaults:{ease:'power4.inOut'},
        onComplete:()=>{
          body.style.overflow=''
          page.classList.remove('is-opening')
          setVisible(false)
          ScrollTrigger.refresh()
        }
      })
      gsap.set('.site-header',{y:-38,autoAlpha:0})
      gsap.set('.hero-media',{scale:1.16})
      gsap.set('.hero-topline, .eyebrow, .hero-caption, .hero-index',{autoAlpha:0,y:28})
      gsap.set('.portfolio-title span',{autoAlpha:0,yPercent:125,scaleX:.62,transformOrigin:'left center'})
      timeline
        .fromTo('.opening-kicker',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.65,ease:'power3.out'},.18)
        .fromTo('.opening-word span',{yPercent:115,scaleX:.64},{yPercent:0,scaleX:1,duration:1.35,ease:'expo.out'},.28)
        .fromTo('.opening-progress i',{scaleX:0},{scaleX:1,duration:1.35,ease:'power2.inOut'},.38)
        .to('.opening-word span',{yPercent:-118,scaleX:.82,duration:.85,ease:'power4.in'},1.68)
        .to('.opening-kicker, .opening-progress',{autoAlpha:0,duration:.42},1.7)
        .to('.opening-panel',{yPercent:-102,duration:1.25,stagger:.09,ease:'power4.inOut'},1.9)
        .to('.hero-media',{scale:1,duration:2,ease:'power3.out'},2.02)
        .to('.site-header',{y:0,autoAlpha:1,duration:1.05,ease:'power4.out'},2.25)
        .to('.hero-topline',{autoAlpha:1,y:0,duration:.9,ease:'power3.out'},2.34)
        .to('.eyebrow',{autoAlpha:1,y:0,duration:.9,ease:'power3.out'},2.42)
        .to('.portfolio-title span',{autoAlpha:1,yPercent:0,scaleX:1,duration:1.55,ease:'expo.out'},2.46)
        .to('.hero-caption',{autoAlpha:1,y:0,duration:1.05,ease:'power4.out'},2.86)
        .to('.hero-index',{autoAlpha:1,y:0,duration:.9,ease:'power3.out'},2.98)
    })
    return()=>{
      context.revert()
      body.style.overflow=''
      page.classList.remove('is-opening')
    }
  },[])
  if(!visible)return null
  return <div className="opening-sequence" ref={root} aria-hidden="true"><div className="opening-panels"><i className="opening-panel"/><i className="opening-panel"/><i className="opening-panel"/><i className="opening-panel"/></div><div className="opening-content"><p className="opening-kicker">WU FENGHUA · SELECTED WORKS 2026</p><div className="opening-word"><span>PORTFOLIO</span></div><div className="opening-progress"><small>VISUAL / AI / BRAND / MOTION</small><i/></div></div></div>
}

function MotionDirector({route}){
  useLayoutEffect(()=>{
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if(reduceMotion)return undefined
    let context
    const frame=requestAnimationFrame(()=>{
      context=gsap.context(()=>{
        const revealSection=(sectionSelector,cardSelector)=>{
          const section=document.querySelector(sectionSelector)
          if(!section)return
          const english=section.querySelector('.bilingual-head h2 small')
          const title=section.querySelector('.bilingual-head h2')
          const copy=section.querySelector('.bilingual-head p')
          const cards=gsap.utils.toArray(section.querySelectorAll(cardSelector))
          const timeline=gsap.timeline({scrollTrigger:{trigger:section,start:'top 72%',once:true}})
          if(english)timeline.from(english,{xPercent:-65,scaleX:.6,autoAlpha:0,duration:1.45,ease:'expo.out'})
          if(title)timeline.from(title,{y:70,autoAlpha:0,duration:1.25,ease:'power4.out'},english?0.18:0)
          if(copy)timeline.from(copy,{y:28,autoAlpha:0,duration:.9,ease:'power3.out'},.45)
          if(cards.length)timeline.from(cards,{y:110,rotationX:8,autoAlpha:0,transformOrigin:'50% 100%',duration:1.35,stagger:.15,ease:'power4.out'},.58)
        }
        if(route==='home'){
          const aboutTimeline=gsap.timeline({scrollTrigger:{trigger:'.about',start:'top 74%',once:true}})
          aboutTimeline
            .from('.about .section-label',{x:-35,autoAlpha:0,duration:.8,ease:'power3.out'})
            .from('.portrait-card',{clipPath:'inset(0 0 100% 0)',y:70,duration:1.45,ease:'power4.inOut'},.08)
            .from('.profile-name',{y:85,scaleX:.78,transformOrigin:'left center',autoAlpha:0,duration:1.35,ease:'expo.out'},.22)
            .from('.about-intro p',{y:38,autoAlpha:0,duration:1,stagger:.14,ease:'power3.out'},.5)
            .from('.contact-list a',{y:24,autoAlpha:0,duration:.8,stagger:.1,ease:'power3.out'},.74)
            .from('.timeline-item',{y:70,autoAlpha:0,duration:1.15,stagger:.16,ease:'power4.out'},.86)
          revealSection('.featured','.folder-project')
          revealSection('.archive','.discipline-card')
          gsap.from('.contact-thanks > *',{y:90,autoAlpha:0,duration:1.35,stagger:.13,ease:'power4.out',scrollTrigger:{trigger:'.contact',start:'top 65%',once:true}})
          gsap.from('.contact-footer > *',{y:38,autoAlpha:0,duration:.9,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.contact-footer',start:'top 92%',once:true}})
          gsap.utils.toArray('.portrait-art img, .project-sheet img, .discipline-cover img').forEach(image=>{
            gsap.fromTo(image,{scale:1.08,yPercent:-3},{scale:1.02,yPercent:5,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:1.4}})
          })
        }
        if(route.startsWith('archive/')){
          gsap.timeline().from('.archive-page-head > *',{y:70,autoAlpha:0,duration:1.2,stagger:.1,ease:'power4.out'}).from('.portfolio-group',{y:100,autoAlpha:0,duration:1.25,stagger:.12,ease:'power4.out'},.42)
        }
        if(route==='project/neon-museum'){
          gsap.timeline().from('.woowu-back',{x:-30,autoAlpha:0,duration:.9,ease:'power3.out'}).from('.woowu-cover-frame',{clipPath:'inset(0 0 100% 0)',scale:.96,duration:1.55,ease:'power4.inOut'},.1).from('.woowu-cover-frame figcaption',{y:20,autoAlpha:0,duration:.7},1)
          gsap.from('.woowu-overview-copy > *',{y:75,autoAlpha:0,duration:1.25,stagger:.12,ease:'power4.out',scrollTrigger:{trigger:'.woowu-overview',start:'top 70%',once:true}})
          gsap.from('.woowu-overview .metrics > *',{y:45,autoAlpha:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.woowu-overview .metrics',start:'top 88%',once:true}})
          gsap.from('.woowu-long-frame',{clipPath:'inset(0 0 100% 0)',duration:1.6,ease:'power4.inOut',scrollTrigger:{trigger:'.woowu-long-frame',start:'top 82%',once:true}})
        }
        if(route==='project/flux-interface'||route==='project/echo-character'){
          gsap.from('.baimeng-cover-frame',{clipPath:'inset(0 0 100% 0)',scale:.96,duration:1.55,ease:'power4.inOut'})
          gsap.utils.toArray('.baimeng-case').forEach(card=>gsap.from(card,{y:90,autoAlpha:0,duration:1.25,ease:'power4.out',scrollTrigger:{trigger:card,start:'top 82%',once:true}}))
        }
        if(route==='project/bonfire-game'){
          gsap.timeline()
            .from('.bf-back',{x:-28,autoAlpha:0,duration:.9,ease:'power3.out'})
            .from('.bf-opening-poster',{clipPath:'inset(0 0 100% 0)',scale:.94,duration:1.7,ease:'power4.inOut'},.08)
            .from('.bf-opening-side > *',{y:42,autoAlpha:0,duration:1.05,stagger:.12,ease:'power4.out'},.52)
          gsap.from('.bf-series-copy > *, .bf-version-switch > *',{y:80,autoAlpha:0,duration:1.25,stagger:.11,ease:'power4.out',scrollTrigger:{trigger:'.bf-series',start:'top 70%',once:true}})
          gsap.from('.bf-prologue-copy > *',{y:85,autoAlpha:0,duration:1.25,stagger:.13,ease:'power4.out',scrollTrigger:{trigger:'.bf-prologue',start:'top 68%',once:true}})
          gsap.from('.bf-lore-item',{y:80,autoAlpha:0,duration:1.1,stagger:.14,ease:'power4.out',scrollTrigger:{trigger:'.bf-lore-grid',start:'top 82%',once:true}})
          gsap.from('.bf-map-frame',{clipPath:'inset(0 100% 0 0)',duration:1.65,ease:'power4.inOut',scrollTrigger:{trigger:'.bf-map-frame',start:'top 80%',once:true}})
          gsap.from('.bf-direction-item',{y:70,autoAlpha:0,duration:1.1,stagger:.13,ease:'power4.out',scrollTrigger:{trigger:'.bf-direction-grid',start:'top 84%',once:true}})
          gsap.utils.toArray('.bf-gallery').forEach(gallery=>gsap.from(gallery.children,{y:110,rotationY:6,autoAlpha:0,duration:1.25,stagger:.08,ease:'power4.out',scrollTrigger:{trigger:gallery,start:'top 80%',once:true}}))
          gsap.from('.bf-loop-step',{x:70,autoAlpha:0,duration:1,stagger:.1,ease:'power4.out',scrollTrigger:{trigger:'.bf-loop-steps',start:'top 84%',once:true}})
          gsap.from('.bf-b3-intro-copy > *',{x:-90,autoAlpha:0,duration:1.25,stagger:.12,ease:'power4.out',scrollTrigger:{trigger:'.bf-b3-intro',start:'top 70%',once:true}})
          gsap.from('.bf-b3-hero',{x:120,rotation:6,autoAlpha:0,duration:1.45,ease:'power4.out',scrollTrigger:{trigger:'.bf-b3-intro',start:'top 70%',once:true}})
          gsap.utils.toArray('.bf-parallax').forEach(image=>gsap.fromTo(image,{yPercent:-3},{yPercent:4,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}}))
        }
        ScrollTrigger.refresh()
      })
    })
    return()=>{cancelAnimationFrame(frame);context?.revert()}
  },[route])
  return null
}

function Home({navigate}){return <><Header navigate={navigate}/><OpeningSequence/><main><Hero/><About/><Featured navigate={navigate}/><Archive navigate={navigate}/><Contact/></main></>}

function WoowuProjectPage({project,next,navigate}){
  return <div className="detail-page woowu-project"><Header navigate={navigate}/><main><section className="woowu-cover"><button className="back-link woowu-back" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回项目经历</button><div className="woowu-cover-glow"/><figure className="woowu-cover-frame"><img src="/projects/woowu-ai/detail-cover.jpg" alt="挖物AI平台项目封面"/><figcaption>PROJECT 01 / WOOWU AI PLATFORM</figcaption></figure></section><section className="woowu-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="woowu-overview-copy"><p>AI E-COMMERCE CONTENT PLATFORM / 2025</p><h1>挖物 AI 平台</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="woowu-case-section"><header><span>02 / 项目全案</span><small>FULL CASE STUDY · SCROLL TO EXPLORE</small></header><div className="woowu-long-frame"><img src="/projects/woowu-ai/case-long.jpg" alt="挖物AI平台完整项目内容" loading="eager" decoding="async"/></div></section><section className="next-project woowu-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function BaimengProjectPage({project,next,navigate}){
  return <div className="detail-page baimeng-project"><Header navigate={navigate}/><main><section className="baimeng-cover"><button className="back-link baimeng-back" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回项目经历</button><div className="baimeng-cover-frame"><img src="/projects/baimeng-life-ark/detail-cover.jpg" alt="佰孟生命方舟项目封面"/><span>PROJECT 02 / BAIMENG LIFE ARK</span></div></section><section className="baimeng-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="baimeng-overview-copy"><p>BAIMENG LIFE ARK / 2022—2025</p><h1>佰孟生命方舟</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="baimeng-case-stack">{baimengCaseImages.map((item,index)=><figure className="baimeng-case" key={item.src}><figcaption><span>{String(index+1).padStart(2,'0')} / {item.title}</span><small>{item.en}</small></figcaption><img src={item.src} alt={`佰孟生命方舟${item.title}`} loading={index<2?'eager':'lazy'} decoding="async"/></figure>)}</section><section className="next-project baimeng-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function WoowuIpProjectPage({project,next,navigate}){
  return <div className="detail-page baimeng-project woowu-ip-project"><Header navigate={navigate}/><main><section className="baimeng-cover"><button className="back-link baimeng-back" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回项目经历</button><div className="baimeng-cover-frame"><img src="/projects/woowu-ip/detail-cover.jpg" alt="挖物IP视觉设计项目封面"/><span>PROJECT 03 / WOOWU IP VISUAL DESIGN</span></div></section><section className="baimeng-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="baimeng-overview-copy"><p>WOOWU IP VISUAL DESIGN / IP SYSTEM</p><h1>挖物 IP 视觉设计</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="baimeng-case-stack">{woowuIpCaseImages.map((item,index)=><figure className="baimeng-case" key={item.src}><figcaption><span>{String(index+2).padStart(2,'0')} / {item.title}</span><small>{item.en}</small></figcaption><img src={item.src} alt={`挖物IP视觉设计 ${item.title}`} loading={index<2?'eager':'lazy'} decoding="async"/></figure>)}</section><section className="next-project baimeng-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function BonfireGallery({items,className}){
  const [activeIndex,setActiveIndex]=useState(null)
  useEffect(()=>{
    if(activeIndex===null)return undefined
    const onKeyDown=event=>{
      if(event.key==='Escape')setActiveIndex(null)
      if(event.key==='ArrowRight')setActiveIndex(current=>(current+1)%items.length)
      if(event.key==='ArrowLeft')setActiveIndex(current=>(current-1+items.length)%items.length)
    }
    const previousOverflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    window.addEventListener('keydown',onKeyDown)
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',onKeyDown)}
  },[activeIndex,items.length])
  const activeItem=activeIndex===null?null:items[activeIndex]
  return <>{items.map((item,index)=><button className={className} key={item.src} onClick={()=>setActiveIndex(index)} aria-label={`查看${item.name}大图`}><span className="bf-frame-no">{String(index+1).padStart(2,'0')}</span><img src={item.src} alt={item.name} loading="lazy" decoding="async"/><span className="bf-card-caption"><strong>{item.name}</strong><small>{item.type}</small></span></button>)}{activeItem&&createPortal(<div className="bf-lightbox" role="dialog" aria-modal="true" aria-label={`${activeItem.name}大图预览`} onMouseDown={event=>{if(event.target===event.currentTarget)setActiveIndex(null)}}><button className="bf-lightbox-close" onClick={()=>setActiveIndex(null)}>关闭 ×</button><button className="bf-lightbox-prev" onClick={()=>setActiveIndex(current=>(current-1+items.length)%items.length)} aria-label="上一张">←</button><img src={activeItem.src} alt={activeItem.name}/><button className="bf-lightbox-next" onClick={()=>setActiveIndex(current=>(current+1)%items.length)} aria-label="下一张">→</button><p>{activeItem.name}<small>{activeItem.type} · {String(activeIndex+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</small></p></div>,document.body)}</>
}

function BonfireSectionHead({no,en,zh,copy,light=false}){
  return <header className={`bf-section-head ${light?'is-light':''}`}><span>{no} / {en}</span><div><h2>{zh}<small>{en}</small></h2><p>{copy}</p></div></header>
}

function BonfireProjectPage({project,next,navigate}){
  return <div className="detail-page bonfire-project-v2"><Header navigate={navigate}/><main>
    <section className="bf-opening">
      <button className="back-link bf-back" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回项目经历</button>
      <img className="bf-opening-bg" src="/projects/bonfire-game/detail-cover.png" alt="" aria-hidden="true"/>
      <div className="bf-opening-shade"/>
      <img className="bf-opening-poster" src="/projects/bonfire-game/detail-cover.png" alt="篝火游戏设计项目封面"/>
      <div className="bf-opening-side bf-opening-left"><span>PROJECT 04</span><small>GAME VISUAL DESIGN<br/>IDLE STRATEGY RPG</small></div>
      <div className="bf-opening-side bf-opening-right"><span>II / III</span><small>TWO GENERATIONS<br/>ONE GAMEPLAY DNA</small></div>
    </section>
    <section className="bf-series section">
      <div className="bf-series-copy"><span>01 / SERIES OVERVIEW</span><h1>同一套放置策略，<br/>两次视觉进化。</h1><div><p>{project.description}</p><p>两款项目的玩法均参考经典放置 RPG 框架，以英雄收集、阵营克制、阵容站位和挂机成长为核心。篝火2强调古典奇幻绘本的沉浸感；篝火3则在相同玩法基础上探索更现代的角色与界面语言。</p></div></div>
      <nav className="bf-version-switch" aria-label="篝火项目版本导航"><a href="#bonfire-2"><span>II</span><div><strong>篝火2</strong><small>古典奇幻 · 重点项目</small></div><i>进入主项目 ↓</i></a><a href="#bonfire-3"><span>III</span><div><strong>篝火3</strong><small>现代风格 · 视觉迭代</small></div><i>查看迭代 ↓</i></a></nav>
    </section>
    <section className="bf-prologue" id="bonfire-2">
      <img className="bf-prologue-map bf-parallax" src="/projects/bonfire-game/map-factions.jpg" alt="艾瑟拉大陆势力地图"/>
      <div className="bf-prologue-shade"/>
      <div className="bf-prologue-copy section"><span>BONFIRE II · THE TWILIGHT OF AETHERA</span><h2>“当艾瑟拉的群星逐渐沉沦，唯有这簇不灭的篝火，是撕裂长夜的利刃。”</h2><div><p>《篝火》是一款设定在经典“剑与魔法”世界中的策略放置类 RPG。深邃的宏大叙事构成骨架，古典绘本式视觉构成皮相，玩家将在长夜中集结英雄、寻找薪柴，并重新点燃散落于大陆的原初篝火。</p><ul><li>策略放置 RPG</li><li>英雄群像与阵营克制</li><li>古典奇幻绘本风格</li></ul></div></div>
    </section>
    <section className="bf-world section">
      <BonfireSectionHead no="02" en="WORLD & NARRATIVE" zh="艾瑟拉的黄昏与余烬" copy="世界观围绕灾厄、篝火与守火人的宿命展开，地图不仅承担叙事氛围，也连接探索、关卡与阵营关系。"/>
      <div className="bf-lore-grid"><article className="bf-lore-item"><span>01</span><h3>长夜降临</h3><p>未知灾厄“蚀界之影”吞噬大陆生机。众神陨落，帝国崩塌，无尽迷雾将文明切割成孤立废墟。</p></article><article className="bf-lore-item"><span>02</span><h3>原初篝火</h3><p>先知遗留的篝火能够驱散迷雾、抵御灾厄，成为残存智慧种族最后的庇护所。</p></article><article className="bf-lore-item"><span>03</span><h3>守火人的宿命</h3><p>玩家集结不同种族与阵营的英雄，以篝火为据点，寻找薪柴并逐步驱散永夜。</p></article></div>
      <figure className="bf-map-frame"><img src="/projects/bonfire-game/map-factions.jpg" alt="艾瑟拉大陆完整势力地图" loading="eager"/><figcaption><span>AETHERA WORLD MAP 3.0</span><small>地貌 / 势力 / 探索路径</small></figcaption></figure>
      <div className="bf-direction-grid"><article className="bf-direction-item"><span>ART 01</span><h3>彩绘玻璃与塔罗牌</h3><p>硬朗而富装饰性的线条、大块高对比色与中世纪羊皮纸质感，共同形成“可以玩的古典奇幻绘本”。</p></article><article className="bf-direction-item"><span>ART 02</span><h3>火与暗的对照</h3><p>冷色废墟、幽蓝迷雾与深渊暗紫构成世界底色；赤红、鎏金与明黄只在篝火和技能高光中出现。</p></article><article className="bf-direction-item"><span>ART 03</span><h3>阵营识别系统</h3><p>耀光的银金秩序、森之子的自然纹样、深渊遗民的破碎哥特线条，让角色在群像中保持清晰归属。</p></article></div>
    </section>
    <section className="bf-b2-characters">
      <div className="section"><BonfireSectionHead no="03" en="BONFIRE II · CHARACTER ART" zh="篝火2 · 角色立绘" copy="角色设计以阵营、职业和剪影为第一识别层，通过武器、姿态与受控的高饱和色建立英雄群像。" light/><div className="bf-gallery bf-b2-character-grid"><BonfireGallery items={bonfire2Characters} className="bf-character-card is-b2"/></div></div>
    </section>
    <section className="bf-b2-ui section">
      <BonfireSectionHead no="04" en="BONFIRE II · UI DESIGN" zh="篝火2 · 游戏界面" copy="UI 与角色立绘分开展示。界面以羊皮纸、金色装饰框和阵营色为基础，覆盖主线、副本、角色、工坊、活动和公会系统。"/>
      <div className="bf-ui-note"><p>竖屏信息密度较高，因此通过统一顶部资源栏、品质框、分页标签和主操作按钮稳定浏览顺序；核心角色图被用作功能入口的视觉锚点。</p><span>08 SELECTED SCREENS<br/>CLASSIC FANTASY UI</span></div>
      <div className="bf-gallery bf-ui-grid is-b2"><BonfireGallery items={bonfire2UiScreens} className="bf-ui-card is-b2"/></div>
    </section>
    <section className="bf-b2-gameplay">
      <div className="section"><BonfireSectionHead no="05" en="BONFIRE II · CORE EXPERIENCE" zh="篝火2 · 核心玩法" copy="玩法对齐美术与世界观：围绕篝火形成挂机收益、英雄招募、阵容搭配、战斗推进和持续成长的循环。" light/><div className="bf-loop-steps"><article className="bf-loop-step"><b>01</b><span>守火挂机</span><small>收集薪柴与成长资源</small></article><article className="bf-loop-step"><b>02</b><span>集结英雄</span><small>建立职业和阵营羁绊</small></article><article className="bf-loop-step"><b>03</b><span>排兵布阵</span><small>站位、克制与技能时机</small></article><article className="bf-loop-step"><b>04</b><span>点燃大陆</span><small>推进地图并驱散永夜</small></article></div><div className="bf-gallery bf-gameplay-grid"><BonfireGallery items={bonfire2Gameplay} className="bf-gameplay-card"/></div></div>
    </section>
    <section className="bf-assets section"><BonfireSectionHead no="06" en="BONFIRE II · ASSET SYSTEM" zh="道具与纹章资产" copy="统一轮廓、材质光源和品质色，形成可批量扩展的资源图标与纹章库，为持续内容生产提供稳定规范。"/><div className="bf-assets-grid"><figure><img src="/projects/bonfire-game/asset-items.png" alt="篝火2道具与资源图标" loading="lazy"/><figcaption>ITEM & RESOURCE ICONS / 46 FILES</figcaption></figure><figure><img src="/projects/bonfire-game/asset-emblems.png" alt="篝火2纹章系统" loading="lazy"/><figcaption>EMBLEM SYSTEM / 66 FILES</figcaption></figure></div></section>
    <section className="bf-b3-intro" id="bonfire-3"><div className="bf-b3-intro-copy section"><span>BONFIRE III · MODERN ITERATION</span><h2>同一玩法骨架，<br/>进入更现代的视觉语境。</h2><p>篝火3延续英雄收集、放置成长与阵容策略，仅对视觉方向进行现代化迭代。角色强化能量特效、机械结构与更锐利的剪影；UI 转向深色底、紫色强调和更模块化的信息组织。</p><div><b>SHARED</b><span>放置成长 / 英雄收集 / 阵营策略</span><b>UPDATED</b><span>现代角色 / 深色 UI / 模块化信息</span></div></div><img className="bf-b3-hero" src="/projects/bonfire-game/b3-character-01.webp" alt="篝火3现代角色立绘" loading="lazy"/></section>
    <section className="bf-b3-characters section"><BonfireSectionHead no="07" en="BONFIRE III · CHARACTER ART" zh="篝火3 · 现代角色" copy="保留英雄群像与职业差异，在轮廓、机械结构、霓虹能量和特效方向上建立更现代的辨识度。"/><div className="bf-gallery bf-b3-character-grid"><BonfireGallery items={bonfire3Characters} className="bf-character-card is-b3"/></div></section>
    <section className="bf-b3-ui"><div className="section"><BonfireSectionHead no="08" en="BONFIRE III · UI DESIGN" zh="篝火3 · 现代界面" copy="角色立绘与 UI 继续分章展示。深色界面承载战斗与社交模块，紫色能量条和斜切组件强化速度与科技感。" light/><div className="bf-gallery bf-ui-grid is-b3"><BonfireGallery items={bonfire3UiScreens} className="bf-ui-card is-b3"/></div></div></section>
    <section className="bf-conclusion"><span>BONFIRE II / BONFIRE III</span><h2>玩法保持一致，视觉持续进化。</h2><p>篝火2以古典绘本构建艾瑟拉的史诗感，篝火3用现代角色和界面语言完成下一阶段探索。两代项目共同形成从世界观、角色、UI到实机验证的完整游戏视觉设计实践。</p></section>
    <section className="next-project bf-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section>
  </main></div>
}

function ProjectPage({id,navigate}){
  const project=projects.find(item=>item.id===id)||projects[0],next=projects[(projects.indexOf(project)+1)%projects.length]
  if(project.id==='neon-museum')return <WoowuProjectPage project={project} next={next} navigate={navigate}/>
  if(project.id==='flux-interface')return <BaimengProjectPage project={project} next={next} navigate={navigate}/>
  if(project.id==='echo-character')return <WoowuIpProjectPage project={project} next={next} navigate={navigate}/>
  if(project.id==='bonfire-game')return <BonfireProjectPage project={project} next={next} navigate={navigate}/>
  return <div className={`detail-page tone-${project.tone}`}><Header navigate={navigate}/><main><section className="detail-hero"><button className="back-link" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回作品索引</button><div className="detail-title"><span>精选项目 / {project.index}</span><h1>{project.title}</h1><p>{project.cn}</p></div><div className="detail-art"><div className="detail-orb"/><div className="detail-grid"/><b>{project.index}</b></div><div className="detail-meta">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></section><section className="detail-intro section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><h2>{project.description}</h2><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="case-grid section">{[1,2,3,4].map(item=><div className={`case-visual visual-${item}`} key={item}><span>0{item} / 视觉研究</span><i/></div>)}</section><section className="next-project"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function WorkGroup({group,index}){
  const [viewerIndex,setViewerIndex]=useState(null)
  const media=group.media
  useEffect(()=>{
    if(viewerIndex===null)return
    const previousOverflow=document.body.style.overflow
    const onKeyDown=event=>{
      if(event.key==='Escape')setViewerIndex(null)
      if(event.key==='ArrowRight')setViewerIndex(current=>(current+1)%media.length)
      if(event.key==='ArrowLeft')setViewerIndex(current=>(current-1+media.length)%media.length)
    }
    document.body.style.overflow='hidden'
    window.addEventListener('keydown',onKeyDown)
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',onKeyDown)}
  },[viewerIndex,media.length])
  const viewer=viewerIndex!==null?<ProjectViewer group={group} index={viewerIndex} onClose={()=>setViewerIndex(null)} onChange={setViewerIndex}/>:null
  if(group.long){
    const item=media[0]
    return <article className="portfolio-group long-work"><button className="long-preview" onClick={()=>setViewerIndex(0)}><PortfolioMedia item={item} alt={`${group.title}设计长图封面`} preview/><span className="long-action">点击查看完整长图 / VIEW FULL PAGE</span></button><GroupCopy group={group} index={index} count={media.length}/>{viewer}</article>
  }
  if(media.length===1){
    const item=media[0]
    return <article className="portfolio-group single-work"><button className={`single-gallery ${item.type==='video'?'single-video':''}`} onClick={()=>setViewerIndex(0)}><PortfolioMedia item={item} alt={group.title} preview/><span className="single-badge">点击查看完整作品 / OPEN WORK</span></button><GroupCopy group={group} index={index} count={1}/>{viewer}</article>
  }
  const previewMedia=media.slice(0,4)
  const center=(previewMedia.length-1)/2
  const fanStep=Math.min(105,620/(previewMedia.length-1))
  return <article className="portfolio-group folded-work"><button className="stack-gallery" onClick={()=>setViewerIndex(0)} aria-haspopup="dialog">{previewMedia.map((item,mediaIndex)=>{const position=mediaIndex-center;return <span className="stack-media" key={item.src} style={{'--rest-x':`${position*7}px`,'--rest-y':`${-mediaIndex*10}px`,'--rest-r':`${position*1.1}deg`,'--fan-x':`${position*fanStep}px`,'--fan-r':`${position*2}deg`,'--z':previewMedia.length-mediaIndex}}><PortfolioMedia item={item} alt={`${group.title} / ${item.name}`} preview/></span>})}<span className="stack-count">{media.length}<small>FILES</small></span><span className="stack-hint">悬停展开封面 · 点击查看全部 / CLICK TO VIEW ALL</span></button><GroupCopy group={group} index={index} count={media.length}/>{viewer}</article>
}

function ProjectViewer({group,index,onClose,onChange}){
  const item=group.media[index]
  const isLong=item.type==='image'&&item.height/item.width>2.2
  const previous=()=>onChange((index-1+group.media.length)%group.media.length)
  const next=()=>onChange((index+1)%group.media.length)
  return createPortal(<div className="project-viewer" role="dialog" aria-modal="true" aria-label={`${group.title}完整项目查看器`} onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><div className="viewer-shell"><header className="viewer-header"><div><span>{group.title}</span><small>{item.name} · {String(index+1).padStart(2,'0')} / {String(group.media.length).padStart(2,'0')}</small></div><button onClick={onClose} aria-label="关闭完整项目">关闭 ×</button></header><div className={`viewer-media ${isLong?'is-long':''}`}><PortfolioMedia item={item} alt={`${group.title} / ${item.name}`} viewer/></div>{group.media.length>1&&<><button className="viewer-arrow viewer-prev" onClick={previous} aria-label="上一页">←</button><button className="viewer-arrow viewer-next" onClick={next} aria-label="下一页">→</button><div className="viewer-thumbs">{group.media.map((mediaItem,mediaIndex)=><button key={mediaItem.src} className={mediaIndex===index?'active':''} onClick={()=>onChange(mediaIndex)} aria-label={`查看第 ${mediaIndex+1} 页`}><PortfolioMedia item={mediaItem} alt={mediaItem.name} preview/><span>{String(mediaIndex+1).padStart(2,'0')}</span></button>)}</div></>}</div></div>,document.body)
}

function GroupCopy({group,index,count}){return <div className="group-copy"><span>{String(index+1).padStart(2,'0')} / {count>1?'PROJECT GROUP':'SINGLE PROJECT'} · {count} FILE{count>1?'S':''}</span><h2>{group.title}<small>{group.en}</small></h2><p>{group.description}</p></div>}

function ArchivePage({id,navigate}){
  const category=categories.find(item=>item.id===id)||categories[0]
  const compact=category.groups.length>6
  return <div className="archive-page" style={{'--category-color':category.color}}><Header navigate={navigate}/><main><section className="archive-page-head"><button className="back-link" onClick={()=>navigate('/',{restoreHomeScroll:true})}><span>←</span> 返回全部作品分类</button><span>{category.no} / 作品索引</span><h1>{category.en}</h1><p>{category.zh} · {category.count}</p></section><section className={`portfolio-groups section ${compact?'compact-groups':''}`}>{category.groups.map((group,index)=><WorkGroup key={`${group.title}-${index}`} group={group} index={index}/>)}</section></main></div>
}
export default function App(){const [route,navigate]=useRoute();let page=<Home navigate={navigate}/>;if(route.startsWith('project/'))page=<ProjectPage id={route.split('/')[1]} navigate={navigate}/>;if(route.startsWith('archive/'))page=<ArchivePage id={route.split('/')[1]} navigate={navigate}/>;return <><CursorGlow/><MotionDirector route={route}/>{page}</>}
