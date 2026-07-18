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

const experience = [
  { year:'2022.11—2025.04', role:'设计师', company:'福州佰孟生命科技有限公司', text:'主导品牌 VI 系统升级、小程序 UI 与电商视觉建设，并将 AI 嵌入团队工作流，提升品牌物料迭代与协作效率。' },
  { year:'2025.04—2026.03', role:'UI 设计师', company:'福州艾思派克网络科技有限公司', text:'负责平台 UI 与活动视觉，运用 AIGC 完成叙事和风格探索，统筹三代产品设计并沉淀组件规范。' },
  { year:'2026.03—至今', role:'AI 产品专家', company:'福州完美映像文化传媒有限公司', text:'主导电商 AIGC、视频自动化与挖物 AI 工具从 0 到 1，搭建产品矩阵、交付培训及持续迭代闭环。' },
]

function useRoute(){
  const parse=()=>window.location.pathname.replace(/^\//,'')||'home'
  const [route,setRoute]=useState(parse)
  useEffect(()=>{const onPop=()=>setRoute(parse());window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[])
  const navigate=(path)=>{window.history.pushState({},'',path);setRoute(parse());window.scrollTo({top:0,behavior:'instant'})}
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

function Featured({navigate}){return <section className="section featured" id="featured"><div className="section-label"><span>02</span> 项目经历 / PROJECT EXPERIENCE</div><div className="section-head bilingual-head"><h2>项目经历<small>PROJECT EXPERIENCE</small></h2><p>通过三个代表性项目，呈现我在 AI 产品、生命科技品牌与综合视觉实践中的思考与执行。</p></div><div className="folder-grid">{projects.map(project=><FolderProject key={project.id} project={project} navigate={navigate}/>)}</div></section>}

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
        ScrollTrigger.refresh()
      })
    })
    return()=>{cancelAnimationFrame(frame);context?.revert()}
  },[route])
  return null
}

function Home({navigate}){return <><Header navigate={navigate}/><OpeningSequence/><main><Hero/><About/><Featured navigate={navigate}/><Archive navigate={navigate}/><Contact/></main></>}

function WoowuProjectPage({project,next,navigate}){
  return <div className="detail-page woowu-project"><Header navigate={navigate}/><main><section className="woowu-cover"><button className="back-link woowu-back" onClick={()=>navigate('/')}><span>←</span> 返回项目经历</button><div className="woowu-cover-glow"/><figure className="woowu-cover-frame"><img src="/projects/woowu-ai/detail-cover.jpg" alt="挖物AI平台项目封面"/><figcaption>PROJECT 01 / WOOWU AI PLATFORM</figcaption></figure></section><section className="woowu-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="woowu-overview-copy"><p>AI E-COMMERCE CONTENT PLATFORM / 2025</p><h1>挖物 AI 平台</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="woowu-case-section"><header><span>02 / 项目全案</span><small>FULL CASE STUDY · SCROLL TO EXPLORE</small></header><div className="woowu-long-frame"><img src="/projects/woowu-ai/case-long.jpg" alt="挖物AI平台完整项目内容" loading="eager" decoding="async"/></div></section><section className="next-project woowu-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function BaimengProjectPage({project,next,navigate}){
  return <div className="detail-page baimeng-project"><Header navigate={navigate}/><main><section className="baimeng-cover"><button className="back-link baimeng-back" onClick={()=>navigate('/')}><span>←</span> 返回项目经历</button><div className="baimeng-cover-frame"><img src="/projects/baimeng-life-ark/detail-cover.jpg" alt="佰孟生命方舟项目封面"/><span>PROJECT 02 / BAIMENG LIFE ARK</span></div></section><section className="baimeng-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="baimeng-overview-copy"><p>BAIMENG LIFE ARK / 2022—2025</p><h1>佰孟生命方舟</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="baimeng-case-stack">{baimengCaseImages.map((item,index)=><figure className="baimeng-case" key={item.src}><figcaption><span>{String(index+1).padStart(2,'0')} / {item.title}</span><small>{item.en}</small></figcaption><img src={item.src} alt={`佰孟生命方舟${item.title}`} loading={index<2?'eager':'lazy'} decoding="async"/></figure>)}</section><section className="next-project baimeng-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function WoowuIpProjectPage({project,next,navigate}){
  return <div className="detail-page baimeng-project woowu-ip-project"><Header navigate={navigate}/><main><section className="baimeng-cover"><button className="back-link baimeng-back" onClick={()=>navigate('/')}><span>←</span> 返回项目经历</button><div className="baimeng-cover-frame"><img src="/projects/woowu-ip/detail-cover.jpg" alt="挖物IP视觉设计项目封面"/><span>PROJECT 03 / WOOWU IP VISUAL DESIGN</span></div></section><section className="baimeng-overview section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><div className="baimeng-overview-copy"><p>WOOWU IP VISUAL DESIGN / IP SYSTEM</p><h1>挖物 IP 视觉设计</h1><h2>{project.description}</h2></div><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="baimeng-case-stack">{woowuIpCaseImages.map((item,index)=><figure className="baimeng-case" key={item.src}><figcaption><span>{String(index+2).padStart(2,'0')} / {item.title}</span><small>{item.en}</small></figcaption><img src={item.src} alt={`挖物IP视觉设计 ${item.title}`} loading={index<2?'eager':'lazy'} decoding="async"/></figure>)}</section><section className="next-project baimeng-next"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
}

function ProjectPage({id,navigate}){
  const project=projects.find(item=>item.id===id)||projects[0],next=projects[(projects.indexOf(project)+1)%projects.length]
  if(project.id==='neon-museum')return <WoowuProjectPage project={project} next={next} navigate={navigate}/>
  if(project.id==='flux-interface')return <BaimengProjectPage project={project} next={next} navigate={navigate}/>
  if(project.id==='echo-character')return <WoowuIpProjectPage project={project} next={next} navigate={navigate}/>
  return <div className={`detail-page tone-${project.tone}`}><Header navigate={navigate}/><main><section className="detail-hero"><button className="back-link" onClick={()=>navigate('/')}><span>←</span> 返回作品索引</button><div className="detail-title"><span>精选项目 / {project.index}</span><h1>{project.title}</h1><p>{project.cn}</p></div><div className="detail-art"><div className="detail-orb"/><div className="detail-grid"/><b>{project.index}</b></div><div className="detail-meta">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></section><section className="detail-intro section"><div className="section-label"><span>01</span> 项目概述 / OVERVIEW</div><h2>{project.description}</h2><div className="metrics">{project.metrics.map(metric=><div key={metric}>{metric}</div>)}</div></section><section className="case-grid section">{[1,2,3,4].map(item=><div className={`case-visual visual-${item}`} key={item}><span>0{item} / 视觉研究</span><i/></div>)}</section><section className="next-project"><p>下一个项目 / NEXT</p><button onClick={()=>navigate(`/project/${next.id}`)}>{next.title} <Arrow/></button></section></main></div>
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
  return <div className="archive-page" style={{'--category-color':category.color}}><Header navigate={navigate}/><main><section className="archive-page-head"><button className="back-link" onClick={()=>navigate('/')}><span>←</span> 返回全部作品分类</button><span>{category.no} / 作品索引</span><h1>{category.en}</h1><p>{category.zh} · {category.count}</p></section><section className={`portfolio-groups section ${compact?'compact-groups':''}`}>{category.groups.map((group,index)=><WorkGroup key={`${group.title}-${index}`} group={group} index={index}/>)}</section></main></div>
}
export default function App(){const [route,navigate]=useRoute();let page=<Home navigate={navigate}/>;if(route.startsWith('project/'))page=<ProjectPage id={route.split('/')[1]} navigate={navigate}/>;if(route.startsWith('archive/'))page=<ArchivePage id={route.split('/')[1]} navigate={navigate}/>;return <><CursorGlow/><MotionDirector route={route}/>{page}</>}
