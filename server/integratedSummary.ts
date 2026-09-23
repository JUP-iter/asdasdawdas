export interface IntegratedSummaryText {
  id:string
  title:string
  subtitle:string
  topic:string
  level:string
  readingMinutes:number
  sourceLabel:string
  paragraphs:string[]
  glossary:{term:string;definition:string}[]
  keyPoints:{label:string;keywords:string[]}[]
}

export interface RubricCriterion {
  score:number
  maximum:number
  band:'Insufficient sample'|'Weak'|'Satisfactory'|'Good'|'Excellent'
  feedback:string
}

export interface IntegratedSummaryResult {
  total:number
  maximum:number
  percent:number
  wordCount:number
  paragraphCount:number
  copiedPercent:number
  rubric:{taskAchievement:RubricCriterion;organization:RubricCriterion;language:RubricCriterion}
  strengths:string[]
  nextSteps:string[]
  flags:string[]
  feedback:string
  improvedSummary:string
  annotations:{start:number;end:number;type:'organization'|'language'|'source-use'|'opinion';message:string}[]
  mainIdeas:{label:string;paragraphIndex:number;keywords:string[]}[]
  evaluationMode:'ai'|'deterministic'
  evaluationModel?:string
}

const coreIntegratedSummaryTexts:IntegratedSummaryText[]=[
  {
    id:'equitable-urban-cooling',title:'Cooling cities without increasing inequality',subtitle:'Why climate adaptation must address housing, infrastructure, and social vulnerability together',topic:'Urban studies',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Cities are often warmer than surrounding rural areas because concrete and asphalt absorb solar energy while buildings restrict airflow. This urban heat-island effect is intensifying as climate change raises average temperatures and makes extreme heat more frequent. Yet exposure is not evenly distributed. Districts with little vegetation, crowded housing, and limited public services frequently record the highest temperatures, while residents may also have less access to air conditioning or healthcare. Heat adaptation is therefore both an engineering problem and a question of social equity.',
      'Planting trees is among the most visible responses. A mature canopy provides shade and cools the air as water evaporates from leaves. Trees can also improve air quality and make walking more attractive. Their benefits, however, depend on species, maintenance, and location. Young trees offer limited shade, poorly chosen species may not survive drought, and roots can damage infrastructure. In water-stressed regions, large planting programmes may compete with other essential uses of water.',
      'Green investment can also produce an unintended housing effect. When parks and tree-lined streets make an area more desirable, rents and property prices may rise. Lower-income residents who endured the original environmental burden can then be displaced before receiving the full benefit of the improvement. Researchers sometimes call this process green gentrification. Measures such as rent protection, community land ownership, and affordable-housing requirements can help ensure that environmental upgrades benefit existing communities.',
      'Other cooling methods work at the scale of individual buildings. Light-coloured roofs reflect more sunlight than dark roofs, while insulation and external shading reduce indoor temperatures. These measures can be installed relatively quickly and may reduce energy demand. Their performance varies with climate and building design, however. A reflective roof is less useful where winter heating dominates, and landlords may have little incentive to invest when tenants pay the energy bills.',
      'Public authorities also need reliable local data. A citywide average can hide dangerous conditions on a particular street or inside a poorly ventilated apartment. Mobile sensors, satellite images, and reports from residents can reveal these differences, but measurement alone does not determine priorities. Officials must decide whether to direct resources toward the hottest locations, the greatest number of people, or residents who are least able to protect themselves.',
      'Heat-response plans must also consider daily routines. Outdoor workers, older residents, young children, and people with chronic illnesses face different forms of risk. Opening a cooling centre is of limited value if it is difficult to reach, closes during the hottest evening hours, or is avoided because residents cannot bring pets. Workplace standards, transport access, public information, and healthcare outreach can determine whether physical cooling infrastructure actually prevents illness.',
      'Effective heat policy therefore combines physical interventions with social protection and public participation. No single technology can address unequal exposure, insecure housing, and weak services at the same time. Cities are more likely to reduce harm when they evaluate neighbourhood conditions, involve residents in decisions, protect vulnerable households, and use a mixture of trees, building improvements, cooling centres, and workplace rules.'
    ],
    glossary:[
      {term:'urban heat island',definition:'A built-up area that is warmer than nearby rural land.'},
      {term:'canopy',definition:'The upper layer formed by the branches and leaves of trees.'},
      {term:'gentrification',definition:'Neighbourhood change that can displace lower-income residents as costs rise.'},
      {term:'ventilated',definition:'Supplied with moving fresh air.'},
    ],
    keyPoints:[
      {label:'Heat exposure is unequal and is both a technical and equity issue.',keywords:['heat','unequal','equity','low-income','vulnerable']},
      {label:'Trees cool cities but require time, water, maintenance, and careful planning.',keywords:['trees','shade','water','maintenance','species']},
      {label:'Greening can raise housing costs unless residents are protected.',keywords:['gentrification','rents','displaced','housing','protection']},
      {label:'Building-level cooling helps, but effectiveness and incentives vary.',keywords:['roofs','insulation','shading','energy','landlords']},
      {label:'Local data and community priorities should guide combined interventions.',keywords:['data','residents','combined','participation','priorities']},
    ],
  },
  {
    id:'measuring-food-waste',title:'Why measuring food waste changes the solutions',subtitle:'Different definitions reveal different responsibilities across farms, shops, and households',topic:'Sustainability',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Food waste is commonly presented as a single global problem, but the term covers losses that occur for very different reasons. Crops may remain unharvested, products can be damaged during transport, supermarkets may reject food for cosmetic reasons, and households often discard items after buying too much. Combining these events into one number attracts attention, yet it can conceal where responsibility lies and which intervention is likely to work.',
      'Measurement is difficult because studies do not always define waste in the same way. Some include inedible material such as bones and fruit skins, whereas others count only food that could have been consumed. Researchers may examine weight, economic value, nutritional content, or environmental impact. A kilogram of bread and a kilogram of beef are equal by weight but very different in the land, water, and emissions required to produce them. The choice of measure therefore shapes the apparent importance of each type of waste.',
      'In lower-income regions, a substantial share of loss can occur before food reaches consumers. Farmers may lack refrigerated storage, reliable roads, or access to timely market information. Investments in storage and transport can preserve more food, although new infrastructure must be affordable and suited to local conditions. A high-technology cold-storage system provides little benefit if electricity is unreliable or maintenance is unavailable.',
      'In wealthier households and retail systems, behaviour and commercial standards become more significant. Confusing date labels can lead consumers to discard safe food, promotions may encourage excessive purchases, and large displays can make shops appear well stocked while increasing unsold inventory. Clearer labels, smaller portions, flexible packaging, and improved stock management can reduce these losses. Education campaigns alone tend to have limited effects unless the surrounding purchasing environment also changes.',
      'Redistributing surplus food can address immediate need, but it is not identical to preventing waste. Donation programmes require safe transport, storage, and coordination, and they operate after excess food has already been produced. They may also allow businesses to avoid examining practices that create surplus. For this reason, many waste hierarchies place prevention above redistribution, while still recognising the social value of giving edible food to people rather than sending it to landfill.',
      'Household data presents a further challenge because people do not always report disposal accurately. Bin audits can provide direct evidence but are expensive and may change behaviour while the study is taking place. Diaries reveal why food was discarded, although participants may forget items or present their habits favourably. Researchers increasingly combine methods, recognising that no single measurement captures both the quantity of waste and the decisions that produced it.',
      'Policies are strongest when measurement matches the intended goal. A government concerned with food security may prioritise nutritional value, while a climate strategy may focus on products with high emissions. Effective action also distinguishes avoidable from unavoidable material and prevention from recovery. More precise data does not eliminate political choices, but it makes those choices visible and helps institutions select solutions that address causes rather than merely improving headline figures.'
    ],
    glossary:[
      {term:'cosmetic',definition:'Related to appearance rather than usefulness or quality.'},
      {term:'inventory',definition:'Goods that a business currently holds for sale.'},
      {term:'surplus',definition:'An amount greater than what is needed.'},
      {term:'hierarchy',definition:'A system that ranks options by importance or preference.'},
    ],
    keyPoints:[
      {label:'Food waste occurs at different stages and for different reasons.',keywords:['farmers','transport','retail','households','stages']},
      {label:'Definitions and measures change how the problem appears.',keywords:['measurement','weight','nutrition','environmental','define']},
      {label:'Infrastructure is central before food reaches consumers in lower-income regions.',keywords:['storage','roads','electricity','farmers','infrastructure']},
      {label:'Retail and household waste requires systemic as well as behavioural changes.',keywords:['labels','purchases','packaging','stock','consumers']},
      {label:'Prevention and redistribution serve different purposes.',keywords:['prevention','redistribution','donation','surplus','landfill']},
      {label:'Policy measures should match food-security or environmental goals.',keywords:['policy','goal','security','climate','causes']},
    ],
  },
  {
    id:'digital-classroom-attention',title:'Designing digital classrooms for attention',subtitle:'Moving beyond the simple choice between unrestricted devices and complete bans',topic:'Education',level:'B2–C1',readingMinutes:9,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Debates about laptops and phones in education are often framed as a choice between unrestricted technology and a complete ban. Both positions overlook the fact that digital devices perform several roles at once. They can provide course materials, translation, accessibility tools, and opportunities for collaboration, but they also offer entertainment and social communication. The educational effect of a device depends not only on its presence but on the task, the learner, and the rules surrounding its use.',
      'Attention is limited, and switching between tasks carries a cognitive cost. A student who moves repeatedly between lecture notes and messages must reconstruct the context of the academic task each time. Even brief interruptions can reduce comprehension, especially when material is unfamiliar. Notifications also affect nearby students when screens are visible. However, research based on classroom observation cannot always separate distraction caused by devices from low motivation that already existed.',
      'A universal ban may improve focus in some settings, yet it can create other difficulties. Students with disabilities may depend on assistive software, and multilingual learners may use digital dictionaries. Some students also lack private study spaces or personal computers outside the classroom. If institutions move all digital work beyond class, they may unintentionally disadvantage learners with fewer resources.',
      'Structured use offers a middle position. Teachers can identify moments when screens should be closed, explain why a particular tool is needed, and design short activities that require students to produce rather than merely receive information. Device-free discussion can alternate with collaborative research or data analysis. Such routines reduce uncertainty because students know when technology supports the learning objective and when it competes with it.',
      'Course design matters as much as rules. Long periods of passive listening make unrelated online activity more attractive, whereas questions, retrieval practice, and discussion give students a reason to remain engaged. This does not mean that instructors must entertain students continuously. It means that attention should be treated as a condition to design for, rather than as a fixed personal quality that students either possess or lack.',
      'The quality of evidence also deserves caution. Studies may compare different age groups, subjects, and types of device use, making broad conclusions unreliable. Self-reported screen use is often inaccurate, while examination scores reveal little about collaboration or digital literacy. Institutions should collect several forms of evidence and examine whether a policy works differently for different learners instead of treating one average result as universal.',
      'Institutions should therefore evaluate technology policies by learning purpose and student need. Evidence supports limiting avoidable distraction, but it does not justify assuming that every screen has the same effect. Clear expectations, accessible alternatives, active teaching, and periodic review are more adaptable than a simple rule applied to every course. The aim is not to maximise or eliminate technology, but to make its use deliberate.'
    ],
    glossary:[
      {term:'cognitive',definition:'Related to thinking, learning, and remembering.'},
      {term:'assistive',definition:'Designed to help a person perform a task or overcome a barrier.'},
      {term:'retrieval practice',definition:'Strengthening memory by actively recalling information.'},
      {term:'deliberate',definition:'Intentional and carefully considered.'},
    ],
    keyPoints:[
      {label:'Devices can support learning and create distraction depending on context.',keywords:['devices','support','distraction','task','rules']},
      {label:'Task switching and notifications can reduce comprehension.',keywords:['attention','switching','notifications','interruptions','comprehension']},
      {label:'Universal bans can disadvantage students with accessibility or resource needs.',keywords:['ban','disabilities','accessibility','multilingual','resources']},
      {label:'Structured use connects technology to specific learning purposes.',keywords:['structured','screens','tool','objective','routines']},
      {label:'Active course design helps sustain attention.',keywords:['course design','active','discussion','retrieval','engaged']},
      {label:'Policies should be purposeful, accessible, and reviewed.',keywords:['policies','purpose','alternatives','review','deliberate']},
    ],
  },
  {
    id:'freshwater-microplastics',title:'Tracing microplastics through freshwater systems',subtitle:'Why identifying sources and pathways matters more than counting particles alone',topic:'Environmental science',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Microplastics are plastic particles smaller than five millimetres, but this simple definition includes materials with very different shapes, chemical compositions, and origins. Some are manufactured at a small size, while others form as larger objects fragment under sunlight and physical stress. Rivers and lakes receive fibres from clothing, fragments from packaging, particles from vehicle tyres, and industrial materials. Understanding freshwater pollution therefore requires more than reporting a total particle count.',
      'Sampling methods strongly influence the results of a study. A net moving across the water surface captures relatively large floating pieces but may miss smaller particles or material that has sunk. Samples taken from sediment reveal another part of the system, while laboratory filters can detect fine particles at much greater cost. Researchers must also prevent plastic from clothing and equipment from contaminating samples. Without consistent methods, comparisons between locations or years can be misleading.',
      'Particles move through freshwater environments in complex ways. Rain can wash tyre dust and street litter into drains, wastewater plants release some fibres that treatment does not capture, and floods remobilise material stored in riverbanks. At the same time, vegetation, reservoirs, and slow-moving water may trap particles temporarily. A low measurement downstream does not necessarily mean that little plastic entered the river; some of it may have accumulated elsewhere in the catchment.',
      'The ecological effects are still being investigated. Laboratory studies show that some organisms consume microplastics and may experience inflammation, reduced feeding, or exposure to chemicals attached to the particles. However, laboratory concentrations are sometimes higher than those found in natural water, and species respond differently. Field studies are essential for determining how particle size, shape, and chemical additives interact with other pressures such as temperature change and conventional pollution.',
      'Possible interventions operate at several points. Filters on washing machines can reduce synthetic fibres, improved storm-water systems can capture road runoff, and product redesign can limit unnecessary plastic. Wastewater upgrades remove additional particles but require energy, investment, and continuing maintenance. River clean-ups are visible and useful for larger litter, yet they collect only a small part of the microscopic material already dispersed through water and sediment.',
      'Policy is complicated by uncertainty, but incomplete evidence does not require inaction. Authorities can prioritise sources that are both substantial and preventable while supporting standardised monitoring. Regulations aimed at one product should be evaluated for unintended substitutions, since replacing one polymer with another disposable material may shift rather than solve the environmental burden. Producers, utilities, transport agencies, and consumers each control different parts of the pathway.',
      'A useful freshwater strategy therefore links measurement to prevention. Comparable sampling can reveal trends, source studies can identify where intervention is practical, and ecological research can clarify which particles create the greatest risk. Counting microplastics remains important, but effective policy depends on explaining how particles enter, move through, and affect freshwater systems before selecting a balanced combination of controls.'
    ],
    glossary:[
      {term:'sediment',definition:'Material that settles at the bottom of a body of water.'},
      {term:'catchment',definition:'The area from which water drains into a river or lake.'},
      {term:'remobilise',definition:'To cause stored material to move again.'},
      {term:'polymer',definition:'A large molecule used as the basic material in plastics.'},
    ],
    keyPoints:[
      {label:'Microplastics have varied sources, forms, and properties.',keywords:['particles','fibres','tyres','packaging','sources']},
      {label:'Different sampling methods produce different measurements.',keywords:['sampling','nets','sediment','filters','comparisons']},
      {label:'Particles move, accumulate, and re-enter freshwater systems.',keywords:['rain','wastewater','floods','trap','catchment']},
      {label:'Ecological effects depend on particle and environmental conditions.',keywords:['organisms','effects','laboratory','field','chemicals']},
      {label:'Interventions must address several sources and pathways.',keywords:['washing','storm-water','product','treatment','prevention']},
      {label:'Standard evidence and source-focused policy should guide action.',keywords:['monitoring','policy','sources','risk','controls']},
    ],
  },
  {
    id:'public-transport-fares',title:'Can cheaper public transport transform a city?',subtitle:'The benefits and limits of using fare policy to change mobility',topic:'Transport policy',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Reducing or removing public-transport fares is often presented as a direct way to reduce car use, improve access, and lower household costs. Several cities have experimented with free buses or heavily discounted travel, and these programmes usually increase passenger numbers. Yet higher ridership does not automatically mean that drivers have left their cars at home. New passengers may previously have walked, cycled, or avoided a journey altogether, so the environmental effect depends on who changes behaviour.',
      'For low-income residents, lower fares can produce important benefits even when traffic changes little. Transport costs can restrict access to employment, education, healthcare, and social relationships. A universal free-fare system is simple and avoids the administrative burden or stigma associated with proving eligibility. On the other hand, it also subsidises passengers who can easily afford tickets, which may be a poor use of limited public funds.',
      'Service quality is often more important than price for people who currently drive. A bus that is free but infrequent, slow, crowded, or unreliable may not compete with a private car. If a fare reduction attracts many passengers without additional vehicles and staff, overcrowding can make the system less appealing. Revenue lost from tickets must therefore be replaced from taxation or another source if the network is to maintain or expand service.',
      'Transport systems also shape land use over time. Reliable routes allow households to reach more opportunities without owning a car, while frequent connections can support denser neighbourhoods around stations. However, improved access may raise nearby property values and rents. As with other public investment, transport policy needs housing measures if existing residents are to share fully in the benefits of a better-connected area.',
      'Targeted discounts offer an alternative to universal free travel. Reduced fares can be provided to young people, older adults, job seekers, or households below an income threshold. This directs support toward groups likely to benefit most, but complicated application processes can exclude eligible passengers. Digital ticketing may simplify administration while creating barriers for people without bank accounts, smartphones, stable addresses, or confidence in sharing personal data.',
      'Measures beyond fares determine whether people change modes. Dedicated bus lanes improve speed and reliability, safe walking routes help passengers reach stops, and parking charges make driving less attractive. Coordinated timetables and integrated tickets reduce the difficulty of transferring between services. Fare policy is most effective when it forms one part of a broader package rather than being expected to overcome every weakness in the transport network.',
      'Cheaper public transport should consequently be judged against several goals. It may succeed as social policy by improving access even if car traffic falls only slightly. Environmental success requires evidence that journeys shift away from high-emission modes, while operational success depends on funding and service capacity. Cities must identify the problem they are trying to solve and combine pricing with reliable service, accessible administration, land-use planning, and controls on car use.'
    ],
    glossary:[
      {term:'ridership',definition:'The number of passengers using a transport service.'},
      {term:'stigma',definition:'A negative social feeling attached to a condition or status.'},
      {term:'land use',definition:'The way land is organised for housing, work, transport, and other purposes.'},
      {term:'eligibility',definition:'The state of meeting the rules required to receive something.'},
    ],
    keyPoints:[
      {label:'Lower fares raise ridership but do not necessarily reduce driving.',keywords:['fares','ridership','drivers','walking','environmental']},
      {label:'Affordable transport can improve access for low-income residents.',keywords:['low-income','access','employment','universal','funds']},
      {label:'Service quality and replacement funding remain essential.',keywords:['quality','reliable','overcrowding','revenue','funding']},
      {label:'Transport investment affects neighbourhoods and housing costs.',keywords:['land use','property','rents','housing','residents']},
      {label:'Targeted discounts can focus support but create administrative barriers.',keywords:['targeted','discounts','eligible','digital','barriers']},
      {label:'Fare changes work best with service and car-use policies.',keywords:['bus lanes','parking','integrated','package','car use']},
    ],
  },
  {
    id:'sleep-university-learning',title:'Sleep as part of the learning process',subtitle:'How timing, memory, and institutional routines shape academic performance',topic:'Learning science',level:'B2–C1',readingMinutes:9,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'University students often treat sleep as time taken away from study, especially before an examination or deadline. This view assumes that learning occurs only while a person is reading, listening, or practising. Research on memory presents a different picture. During sleep, recently formed memories are stabilised and reorganised, making later retrieval more reliable. Adequate sleep is therefore not simply preparation for learning; it is one stage of the learning process itself.',
      'Sleep influences attention as well as memory. A tired learner may remain physically present in a lecture while missing connections between ideas or responding slowly to new information. Reduced attention also makes study less efficient, so additional hours at a desk do not necessarily compensate for sleep loss. Students may then rely on caffeine or late-night work, creating a cycle in which weak concentration leads to longer study and even less sleep.',
      'Timing matters because human sleep is regulated partly by circadian rhythms. Many adolescents and young adults naturally become sleepy later at night and alert later in the morning. Early classes can conflict with this pattern, particularly when travel time is long. Nevertheless, individual rhythms vary, and simply moving every class later could create difficulties for employment, caring responsibilities, laboratory schedules, and access to shared facilities.',
      'Digital behaviour is one factor, but it should not be treated as the only cause of poor sleep. Bright light and stimulating content can delay sleep, yet students may also use devices late because of heavy workloads, irregular employment, noisy housing, or anxiety. Advice that focuses entirely on personal discipline can ignore these conditions. Effective support must distinguish habits that individuals can change from structural pressures that require institutional action.',
      'Universities can respond in several ways. Timetables can avoid placing compulsory sessions at extreme hours, assessment deadlines can be coordinated across courses, and libraries can communicate that overnight study is not a sign of academic commitment. Health services can provide support for persistent sleep problems. Instructors can also encourage distributed practice, which spreads learning across shorter sessions and reduces the perceived need for last-minute work.',
      'Measuring the relationship between sleep and grades is not straightforward. Students with stronger time-management skills may both sleep more and perform better, making it difficult to identify cause and effect. Self-reported sleep duration is imperfect, while wearable devices estimate rather than directly measure sleep stages. Experimental sleep restriction provides clearer evidence but cannot reproduce every feature of normal university life and raises ethical limits.',
      'The available evidence nevertheless supports treating sleep as an academic resource. Personal routines such as consistent schedules and reduced late-night stimulation can help, but institutions also influence when and how students study. A balanced approach combines individual guidance, thoughtful scheduling, coordinated assessment, and access to health support. The central lesson is that extending study by reducing sleep may undermine the memory and attention that effective study requires.'
    ],
    glossary:[
      {term:'stabilised',definition:'Made more secure and less likely to change or disappear.'},
      {term:'retrieval',definition:'The process of bringing stored information back to mind.'},
      {term:'circadian rhythm',definition:'The internal cycle that influences sleep and alertness over about 24 hours.'},
      {term:'distributed practice',definition:'Study spread across multiple sessions rather than concentrated at one time.'},
    ],
    keyPoints:[
      {label:'Sleep actively supports memory consolidation and learning.',keywords:['sleep','memory','stabilised','retrieval','learning']},
      {label:'Sleep loss reduces attention and study efficiency.',keywords:['tired','attention','efficient','caffeine','cycle']},
      {label:'Circadian timing can conflict with university schedules.',keywords:['circadian','young adults','early','classes','timing']},
      {label:'Digital habits interact with workloads and living conditions.',keywords:['devices','workloads','housing','anxiety','structural']},
      {label:'Universities can improve schedules, assessment, and support.',keywords:['timetables','deadlines','distributed','health','support']},
      {label:'Evidence has limits but supports combined personal and institutional action.',keywords:['evidence','self-reported','individual','institutions','balanced']},
    ],
  },
  {
    id:'citizen-science-biodiversity',title:'When volunteers measure biodiversity',subtitle:'The scientific value and methodological limits of large public datasets',topic:'Ecology',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Citizen-science projects invite members of the public to record birds, insects, plants, weather, and many other features of the natural world. Digital platforms now allow millions of observations to be uploaded with photographs and geographic coordinates. This volume would be difficult for professional researchers to collect alone. Large datasets can reveal migration timing, species distributions, and long-term ecological change across wide areas.',
      'The strength of public participation is also a source of bias. Volunteers are more likely to visit places that are accessible, attractive, or close to cities, leaving remote locations underrepresented. They may record rare or colourful species while ignoring common organisms, and participation often increases on weekends or in good weather. A map of observations therefore reflects both ecological patterns and patterns of human activity.',
      'Differences in identification skill create another challenge. Experienced observers can distinguish similar species by sound or subtle physical features, whereas beginners may make errors or avoid difficult groups. Photographs and automated recognition tools help reviewers verify records, but not every organism can be photographed clearly. Training materials, expert validation, and confidence ratings improve data quality without removing all uncertainty.',
      'Researchers use statistical methods to account for uneven effort. They may compare complete checklists rather than isolated sightings, include the time spent observing, or model the probability that a species was present but not detected. Standard protocols make records easier to compare, although strict procedures can discourage casual participants. Project designers must balance scientific consistency with the openness that allows a large and diverse community to contribute.',
      'Participation can produce benefits beyond data collection. Volunteers develop identification skills, spend time outdoors, and may become more engaged with conservation decisions. Local knowledge can draw attention to changes that formal monitoring has missed. However, projects should not assume that unpaid public effort can replace professional employment. Experts remain necessary to design studies, maintain systems, validate records, analyse results, and monitor locations that receive few volunteers.',
      'Questions of access and ownership are increasingly important. Smartphone-based projects can exclude people without suitable devices or mobile data, while participants may not realise how their photographs and location records will be used. Open datasets support research, but precise locations of threatened species can also assist collectors or disturb sensitive habitats. Clear consent, privacy controls, and careful treatment of vulnerable-species data are essential.',
      'Citizen science is most valuable when its limitations are designed into the research rather than ignored. Volunteer observations can extend the reach of ecological monitoring, especially when projects record effort, offer training, validate uncertain reports, and target geographic gaps. The resulting evidence is neither automatically unreliable nor a complete replacement for professional surveys. It is a distinctive source of knowledge whose quality depends on thoughtful collaboration.'
    ],
    glossary:[
      {term:'coordinates',definition:'Numbers that identify an exact geographic position.'},
      {term:'underrepresented',definition:'Included less often or in smaller numbers than appropriate.'},
      {term:'protocol',definition:'An agreed procedure for carrying out a study.'},
      {term:'validation',definition:'The process of checking that information is accurate or acceptable.'},
    ],
    keyPoints:[
      {label:'Citizen science creates large ecological datasets across wide areas.',keywords:['volunteers','observations','datasets','migration','distribution']},
      {label:'Observation locations and species choices introduce bias.',keywords:['bias','accessible','rare','weather','human activity']},
      {label:'Skill differences require training and record validation.',keywords:['identification','beginners','photographs','training','validation']},
      {label:'Methods can account for uneven effort but may reduce participation.',keywords:['statistical','checklists','effort','protocols','participants']},
      {label:'Projects benefit participants but do not replace professionals.',keywords:['skills','conservation','local knowledge','professional','experts']},
      {label:'Access, consent, privacy, and sensitive data need protection.',keywords:['access','devices','consent','privacy','threatened']},
    ],
  },
  {
    id:'automation-job-quality',title:'Automation changes jobs before it removes them',subtitle:'Why the distribution of tasks may matter more than predictions of mass unemployment',topic:'Economics of work',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Public debate about automation frequently concentrates on the number of jobs that machines might eliminate. Forecasts classify occupations according to their technical exposure and then estimate how many workers are at risk. Such figures attract attention, but an occupation is not a single activity. Most jobs contain a collection of tasks, some routine and predictable, others social, physical, or dependent on judgement. Technologies commonly alter this collection before they replace an occupation entirely.',
      'When software performs repetitive administrative work, employees may have more time for problem-solving and contact with clients. This can raise productivity and make work more interesting. The opposite outcome is also possible. Digital systems can divide skilled work into narrow steps, transfer decisions to an algorithm, and require workers to follow instructions they cannot question. The same technology can therefore increase autonomy in one organisation while reducing it in another.',
      'Monitoring is a particularly important issue. Sensors and software allow employers to measure location, speed, keystrokes, customer ratings, and time away from a task. Data may identify safety problems or improve coordination, yet constant measurement can intensify work and encourage employees to prioritise what is counted over what is valuable. A care worker, for example, may be pressured to shorten visits even when a patient needs conversation that the system does not record.',
      'The effects are distributed unevenly. Workers with specialised knowledge may use new tools to extend their capabilities, while people in lower-paid roles may experience closer control or unstable hours. Firms that can invest in training are better positioned to reorganise work successfully than small employers operating with narrow margins. Regional differences also matter because communities dependent on a small number of industries have fewer alternative jobs when technology reduces local demand.',
      'Training is often proposed as the main solution, but its design is crucial. Short courses in general digital skills cannot prepare every worker for a highly specialised occupation. Effective programmes are linked to real vacancies, recognise existing experience, and provide financial support while people learn. Employers also need incentives to train current staff rather than replacing them with workers who already possess the desired qualifications.',
      'Institutions influence whether productivity gains improve job quality. Collective bargaining can give workers a role in the introduction of monitoring or automated decision systems. Labour standards can protect predictable hours and require human review of important decisions. Tax and social-security systems can support people during transitions. These measures do not stop innovation; they shape who carries its risks and who receives its benefits.',
      'Automation should consequently be evaluated through changes in tasks, power, and working conditions as well as employment totals. Job loss remains a genuine concern in some sectors, but focusing on a distant prediction can obscure changes already occurring inside workplaces. Technology produces better outcomes when workers participate in its design, training connects to opportunity, monitoring is limited, and productivity gains are shared rather than treated as an automatic public benefit.'
    ],
    glossary:[
      {term:'autonomy',definition:'The ability to make decisions and control how work is performed.'},
      {term:'intensify',definition:'To make an activity more demanding or concentrated.'},
      {term:'margins',definition:'The difference between a business’s costs and income.'},
      {term:'collective bargaining',definition:'Negotiation between employers and workers represented as a group.'},
    ],
    keyPoints:[
      {label:'Automation usually changes collections of tasks before whole occupations.',keywords:['automation','occupations','tasks','routine','judgement']},
      {label:'Technology can increase autonomy or narrow and control work.',keywords:['productivity','autonomy','algorithm','instructions','decisions']},
      {label:'Digital monitoring can improve coordination but intensify work.',keywords:['monitoring','data','speed','intensify','valuable']},
      {label:'Effects differ by role, employer resources, and region.',keywords:['unevenly','lower-paid','training','small employers','regional']},
      {label:'Training must connect workers to real opportunities.',keywords:['courses','vacancies','experience','support','employers']},
      {label:'Institutions and worker participation shape how gains are shared.',keywords:['bargaining','standards','human review','risks','benefits']},
    ],
  },
  {
    id:'urban-water-reuse',title:'Making urban water reuse trustworthy',subtitle:'How treatment technology, public confidence, and regulation interact',topic:'Water policy',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Cities facing drought and population growth are increasingly interested in using water more than once. Treated wastewater can irrigate parks, support industry, refill underground reserves, or, after advanced treatment, return to drinking-water supplies. Reuse can provide a source that is less dependent on rainfall and reduce the discharge of wastewater into rivers or the sea. Nevertheless, technical feasibility alone does not guarantee that a scheme will be accepted or managed safely.',
      'Different uses require different levels of treatment. Water for industrial cooling does not need to meet the same standards as drinking water, although workers and surrounding ecosystems still require protection. Advanced systems may combine membranes, ultraviolet light, oxidation, and continuous monitoring. Using treatment appropriate to the intended purpose can save energy and money, but separate distribution pipes increase construction costs and create a risk of incorrect connections.',
      'Public reaction is shaped by more than knowledge of engineering. People may reject recycled water because its history makes it feel contaminated even when tests show that it meets safety standards. Simply telling communities that their concern is irrational can deepen distrust. Projects tend to gain stronger support when authorities discuss options early, explain failures as well as safeguards, and allow independent experts and community representatives to examine performance data.',
      'Language also influences perception. Terms such as purified water emphasise the treatment process, while wastewater reuse reminds listeners of the source. Communication should be clear without becoming promotional. If agencies appear to hide the origin of the water, later discovery can damage confidence. At the same time, dramatic labels can create fear that is not consistent with actual risk. Trust depends on accurate language and a record of transparent operation.',
      'Regulation must address substances that are difficult to monitor individually. Household chemicals, medicines, and industrial compounds enter wastewater in changing combinations. Treatment removes many contaminants, but testing every possible substance continuously is impossible. A multi-barrier system reduces risk through several independent processes, and biological monitoring can complement chemical tests. Clear procedures are also needed for stopping supply when equipment or indicators fail.',
      'Equity questions arise when reuse becomes part of a city’s supply. Expensive infrastructure may increase water bills, placing pressure on low-income households. Industrial users may receive secure recycled water while poorer districts continue to experience unreliable service. Conversely, delaying investment can expose vulnerable communities to severe restrictions during drought. Funding arrangements, minimum-service guarantees, and public oversight determine how costs and reliability are distributed.',
      'Successful reuse programmes therefore combine fit-for-purpose treatment, rigorous monitoring, transparent communication, and fair governance. They should be compared with alternatives such as conservation, leakage repair, desalination, and new reservoirs rather than presented as the only response to scarcity. Recycled water can strengthen urban resilience, but trust develops when institutions demonstrate competence, acknowledge uncertainty, involve the public, and distribute benefits and costs openly.'
    ],
    glossary:[
      {term:'feasibility',definition:'The extent to which a plan is practical and achievable.'},
      {term:'membrane',definition:'A thin barrier that allows some substances to pass while blocking others.'},
      {term:'contaminant',definition:'A substance that makes water impure or potentially unsafe.'},
      {term:'multi-barrier',definition:'A safety approach using several independent layers of protection.'},
    ],
    keyPoints:[
      {label:'Water reuse offers reliable supply and environmental benefits.',keywords:['reuse','drought','rainfall','discharge','supply']},
      {label:'Treatment should match intended use while managing infrastructure risks.',keywords:['treatment','drinking','membranes','energy','pipes']},
      {label:'Public trust requires early engagement and transparent evidence.',keywords:['public','distrust','communities','independent','data']},
      {label:'Accurate language affects risk perception and confidence.',keywords:['language','purified','source','promotional','trust']},
      {label:'Regulation needs multiple barriers and failure procedures.',keywords:['chemicals','monitoring','multi-barrier','tests','fail']},
      {label:'Governance must distribute costs and reliability fairly.',keywords:['equity','bills','low-income','funding','costs']},
    ],
  },
  {
    id:'digital-language-preservation',title:'Preserving languages in a digital world',subtitle:'Why documentation, community control, and everyday use must develop together',topic:'Language studies',level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      'Thousands of languages are used by relatively small communities, and many are under pressure as speakers shift toward languages associated with education, employment, and public services. Digital technology is sometimes presented as a solution because recordings, dictionaries, and lessons can be distributed widely at low cost. These tools are valuable, but preservation is not achieved simply by storing words. A language remains strong when people can use it meaningfully across generations and areas of life.',
      'Documentation creates an important foundation. Audio and video can record pronunciation, stories, songs, conversation, and specialised knowledge, while searchable collections help teachers and researchers. Written descriptions may support literacy materials and future study. However, an archive can preserve evidence of a language after everyday transmission has weakened. Documentation and revitalisation overlap, but they are not the same activity and should not be confused.',
      'Community control is central because language materials can contain personal, ceremonial, or culturally restricted knowledge. Researchers and technology companies may favour open access, whereas speakers may want some recordings available only to particular families or groups. Consent given for one project does not automatically cover future artificial-intelligence training or commercial use. Digital repositories need permissions that can reflect community rules and change over time.',
      'Technical design creates practical barriers. A language may use characters that keyboards do not support, speech-recognition systems may perform poorly with limited training data, and automatic translation can reproduce errors. Interfaces designed for major languages can force users into unfamiliar spelling or categories. Partnerships with speakers are therefore necessary not only to provide content but to decide how a tool represents grammar, pronunciation, variation, and identity.',
      'Education can expand the spaces in which a language is used, but classroom teaching cannot replace family and community interaction. Young learners need opportunities to speak with fluent adults, create media, play games, discuss contemporary topics, and use the language for purposes beyond traditional ceremonies. New vocabulary may be needed for science, technology, and popular culture. Debate about these terms is a normal sign that speakers are adapting the language rather than damaging it.',
      'Online visibility brings both opportunity and risk. Social media connects dispersed speakers and allows small audiences to publish, yet platforms may remove content incorrectly when moderation systems do not recognise the language. Public posts can also expose speakers to harassment or turn cultural knowledge into material consumed without context. Communities may choose a mixture of public resources, private groups, local servers, printed materials, and face-to-face programmes.',
      'Digital preservation is therefore most effective when it supports living relationships. High-quality archives, keyboards, learning applications, and media can assist transmission, but decisions about access, representation, and goals should remain with speakers. Long-term funding and training are needed so communities can maintain systems after outside projects end. Technology contributes most when it expands everyday use and community authority instead of treating a language as data to be collected.'
    ],
    glossary:[
      {term:'transmission',definition:'The passing of a language from one generation or person to another.'},
      {term:'revitalisation',definition:'The process of strengthening a language whose use has declined.'},
      {term:'repository',definition:'A place or system where information is stored and managed.'},
      {term:'dispersed',definition:'Spread across different locations rather than concentrated in one place.'},
    ],
    keyPoints:[
      {label:'Digital tools help, but preservation depends on meaningful language use.',keywords:['technology','tools','preservation','use','generations']},
      {label:'Documentation supports knowledge but differs from revitalisation.',keywords:['documentation','recordings','archive','transmission','revitalisation']},
      {label:'Communities need control over access, consent, and reuse.',keywords:['community','restricted','consent','training','permissions']},
      {label:'Technology must represent language structures and variation appropriately.',keywords:['keyboards','recognition','translation','speakers','identity']},
      {label:'Education should connect classroom learning with contemporary community use.',keywords:['education','family','media','contemporary','vocabulary']},
      {label:'Sustainable digital work requires authority, funding, and maintenance.',keywords:['platforms','funding','maintain','authority','everyday']},
    ],
  },
]

interface PracticeBlueprint{
  slug:string
  subject:string
  topic:string
  intervention:string
  context:string
  benefit:string
  risk:string
  stakeholders:string
  governance:string
  glossary:[{term:string;definition:string},{term:string;definition:string}]
}

const practiceBlueprints:PracticeBlueprint[]=[
  {slug:'renewable-microgrids',subject:'neighbourhood renewable-energy microgrids',topic:'Energy systems',intervention:'linking rooftop solar, shared batteries, and local control systems',context:'electricity networks facing peak demand, decarbonisation targets, and more frequent outages',benefit:'keep essential services operating, reduce transmission losses, and increase the use of locally generated power',risk:'high initial costs, unequal access to suitable roofs, battery degradation, and unclear responsibility during faults',stakeholders:'residents, utilities, regulators, installers, landlords, and emergency services',governance:'connection standards, shared-ownership rules, maintenance funds, transparent tariffs, and emergency protocols',glossary:[{term:'microgrid',definition:'A local energy network that can operate with or independently from the wider grid.'},{term:'peak demand',definition:'The period when electricity use reaches its highest level.'}]},
  {slug:'vertical-farming',subject:'urban vertical farming',topic:'Food systems',intervention:'growing crops in stacked indoor systems with controlled light, water, and nutrients',context:'cities seeking reliable food supplies while land, water, and transport costs increase',benefit:'reduce water use, shorten supply chains, and produce selected crops throughout the year',risk:'large electricity requirements, expensive equipment, narrow crop choices, and dependence on technical expertise',stakeholders:'growers, energy providers, retailers, city planners, consumers, and conventional farmers',governance:'energy disclosure, food-safety standards, land-use rules, research support, and realistic environmental accounting',glossary:[{term:'hydroponic',definition:'Growing plants in nutrient-rich water rather than soil.'},{term:'controlled environment',definition:'An indoor system in which growing conditions are deliberately regulated.'}]},
  {slug:'telemedicine',subject:'telemedicine in regional healthcare',topic:'Public health',intervention:'using video consultations, remote monitoring, and digital records to deliver care at a distance',context:'health systems serving dispersed populations with shortages of specialists and long travel times',benefit:'improve access, reduce unnecessary journeys, and support earlier follow-up for long-term conditions',risk:'missed physical signs, weak internet access, privacy failures, and the exclusion of patients with limited digital skills',stakeholders:'patients, clinicians, carers, hospitals, technology suppliers, and health authorities',governance:'clinical triage rules, privacy protection, accessible alternatives, professional training, and evaluation of health outcomes',glossary:[{term:'triage',definition:'The process of deciding how urgently a patient needs care.'},{term:'remote monitoring',definition:'Collecting health information while a patient is outside a clinical facility.'}]},
  {slug:'coastal-retreat',subject:'managed retreat from vulnerable coastlines',topic:'Climate adaptation',intervention:'moving buildings and infrastructure away from areas exposed to erosion, flooding, and sea-level rise',context:'coastal communities where repeated protection and disaster recovery are becoming increasingly expensive',benefit:'reduce long-term exposure, restore natural buffers, and avoid repeated losses in locations that cannot be defended indefinitely',risk:'loss of community ties, disputed property values, cultural damage, and unequal ability to relocate',stakeholders:'homeowners, tenants, Indigenous groups, local businesses, insurers, planners, and national governments',governance:'early consultation, fair compensation, land acquisition rules, cultural protection, relocation support, and long-term coastal plans',glossary:[{term:'managed retreat',definition:'A planned movement of people and assets away from environmental hazards.'},{term:'natural buffer',definition:'An ecosystem such as a wetland or dune that reduces physical hazards.'}]},
  {slug:'medical-ai',subject:'artificial intelligence in medical diagnosis',topic:'Health technology',intervention:'using computational models to identify patterns in images, records, and clinical measurements',context:'health services managing growing data volumes, workforce pressure, and demand for faster diagnosis',benefit:'support earlier detection, prioritise urgent cases, and provide a consistent second assessment',risk:'biased training data, automation errors, weak explanations, and excessive trust in a model recommendation',stakeholders:'patients, clinicians, hospitals, software developers, regulators, and underrepresented communities',governance:'independent validation, human review, incident reporting, representative data, procurement standards, and clear legal responsibility',glossary:[{term:'training data',definition:'Examples used to develop the behaviour of a computational model.'},{term:'validation',definition:'Testing whether a system performs reliably in the setting where it will be used.'}]},
  {slug:'forest-carbon',subject:'forest restoration for carbon storage',topic:'Conservation',intervention:'recovering degraded forests through natural regeneration, assisted planting, and long-term protection',context:'climate strategies that must remove carbon while supporting biodiversity and local livelihoods',benefit:'store atmospheric carbon, improve habitat, protect soil, and strengthen water regulation',risk:'single-species plantations, overstated carbon claims, fire, insecure land rights, and displacement of food production',stakeholders:'local communities, landowners, conservation groups, governments, investors, and carbon-credit buyers',governance:'secure land rights, ecological monitoring, permanent protection, conservative carbon accounting, benefit sharing, and fire management',glossary:[{term:'natural regeneration',definition:'The recovery of vegetation through natural seed and growth processes.'},{term:'carbon permanence',definition:'The length of time stored carbon remains outside the atmosphere.'}]},
  {slug:'four-day-week',subject:'the four-day working week',topic:'Workplace studies',intervention:'reducing standard working days without automatically reducing pay or expected output',context:'organisations responding to stress, recruitment difficulties, changing technology, and demands for flexibility',benefit:'improve recovery time, retention, and focus while encouraging teams to remove low-value processes',risk:'work intensification, compressed meetings, unequal access, customer-service gaps, and hidden overtime',stakeholders:'employees, managers, customers, unions, carers, and workers in continuous-service sectors',governance:'workload measures, staffing plans, employee consultation, overtime safeguards, outcome evaluation, and sector-specific adaptation',glossary:[{term:'work intensification',definition:'An increase in the amount or pace of work required in a given time.'},{term:'retention',definition:'An organisation’s ability to keep its employees.'}]},
  {slug:'school-meals',subject:'universal school meal programmes',topic:'Education policy',intervention:'providing nutritious meals to every pupil without an income-based application',context:'schools addressing food insecurity, learning inequalities, health, and the stigma attached to targeted support',benefit:'improve reliable access to food, support concentration, and allow children to eat together without visible categories',risk:'high operating costs, food waste, poor menu quality, supply disruption, and limited attention to local dietary needs',stakeholders:'pupils, families, schools, caterers, farmers, health services, and education authorities',governance:'nutrition standards, stable funding, pupil feedback, inclusive menus, procurement rules, and measurement of participation and waste',glossary:[{term:'universal provision',definition:'A service offered to everyone in a defined group without an income test.'},{term:'food insecurity',definition:'Unreliable access to enough safe and nutritious food.'}]},
  {slug:'heritage-tourism',subject:'tourism in historic urban districts',topic:'Cultural policy',intervention:'managing visitor flows, short-term accommodation, heritage sites, and local commercial activity',context:'popular districts balancing conservation income with housing pressure and the needs of permanent residents',benefit:'fund restoration, support employment, and introduce cultural places to wider audiences',risk:'crowding, rising rents, loss of everyday services, superficial cultural presentation, and physical damage to sites',stakeholders:'residents, visitors, guides, property owners, local businesses, conservation bodies, and municipal authorities',governance:'visitor limits, housing regulation, conservation fees, resident participation, business licensing, and reinvestment in local services',glossary:[{term:'carrying capacity',definition:'The level of use a place can sustain without unacceptable harm.'},{term:'commodification',definition:'Treating a cultural practice or place mainly as something to be sold.'}]},
  {slug:'cultivated-meat',subject:'cultivated meat production',topic:'Food technology',intervention:'growing animal cells in controlled facilities to produce edible tissue without raising a whole animal',context:'efforts to meet protein demand while reducing some environmental and animal-welfare impacts of livestock',benefit:'use less land, reduce slaughter, and allow tighter control over selected production conditions',risk:'high energy use, expensive growth materials, uncertain consumer demand, concentrated ownership, and difficult large-scale production',stakeholders:'consumers, farmers, food companies, regulators, researchers, workers, and animal-welfare organisations',governance:'food-safety assessment, accurate labelling, energy reporting, competition policy, public research, and transition support for producers',glossary:[{term:'cell culture',definition:'The growth of cells under controlled laboratory or industrial conditions.'},{term:'growth medium',definition:'A mixture of nutrients used to support cells as they grow.'}]},
  {slug:'battery-recycling',subject:'recycling batteries from electric vehicles',topic:'Circular economy',intervention:'collecting used vehicle batteries for repair, second-life use, and recovery of valuable materials',context:'rapid growth in electric transport and demand for lithium, nickel, cobalt, graphite, and other materials',benefit:'reduce mining pressure, recover strategic resources, and lower the waste associated with transport electrification',risk:'fire during transport, variable battery designs, energy-intensive processing, weak collection systems, and unsafe informal recycling',stakeholders:'drivers, vehicle manufacturers, recyclers, miners, emergency services, workers, and environmental regulators',governance:'design standards, producer responsibility, battery records, safe transport, recovery targets, worker protection, and international coordination',glossary:[{term:'second-life use',definition:'Using a product in a new role after it no longer meets its original requirements.'},{term:'producer responsibility',definition:'A rule making manufacturers responsible for products after consumers finish using them.'}]},
  {slug:'open-textbooks',subject:'open educational resources at universities',topic:'Higher education',intervention:'creating and sharing textbooks, lessons, and media under licences that permit free use and adaptation',context:'institutions seeking to reduce student costs and update teaching materials more flexibly',benefit:'remove price barriers, allow local adaptation, and give students access from the beginning of a course',risk:'uneven quality, hidden production labour, weak technical support, uncertain maintenance, and materials that become outdated',stakeholders:'students, instructors, librarians, authors, universities, funders, and commercial publishers',governance:'peer review, accessible formats, author recognition, revision plans, institutional funding, and clear licensing guidance',glossary:[{term:'open licence',definition:'Legal permission to use and often modify a creative work under stated conditions.'},{term:'local adaptation',definition:'Changing material to suit a particular place, course, or learner group.'}]},
  {slug:'cashless-payments',subject:'the shift toward cashless payment',topic:'Digital society',intervention:'replacing notes and coins with cards, mobile applications, and account-based transfers',context:'economies seeking faster transactions while banks, retailers, and public services become increasingly digital',benefit:'increase convenience, reduce some handling costs, and create records that can help users and businesses manage transactions',risk:'exclusion without accounts or devices, service outages, surveillance, fraud, fees, and reduced control over personal spending data',stakeholders:'consumers, retailers, banks, payment platforms, older adults, migrants, and public authorities',governance:'cash acceptance rules, offline options, fee limits, privacy standards, fraud protection, and accessible financial services',glossary:[{term:'financial inclusion',definition:'Access to useful and affordable financial services.'},{term:'transaction data',definition:'Information recording when, where, and how a payment occurred.'}]},
  {slug:'urban-freight',subject:'low-emission urban freight',topic:'Urban logistics',intervention:'combining delivery hubs, cargo bicycles, electric vans, and coordinated routes for the final stage of distribution',context:'cities managing rapid delivery growth, congestion, air pollution, noise, and competition for street space',benefit:'reduce local emissions, improve vehicle use, and make dense neighbourhood deliveries quieter and safer',risk:'extra handling, limited cargo capacity, expensive hubs, pressure on delivery workers, and emissions shifted to electricity production',stakeholders:'residents, couriers, retailers, logistics firms, drivers, property owners, and city authorities',governance:'kerb access, labour standards, hub planning, charging infrastructure, emissions reporting, and shared delivery systems',glossary:[{term:'last-mile delivery',definition:'The final movement of goods from a distribution point to the recipient.'},{term:'consolidation hub',definition:'A facility where goods are combined into more efficient delivery loads.'}]},
  {slug:'precision-agriculture',subject:'precision agriculture for small farms',topic:'Agricultural technology',intervention:'using sensors, satellite data, local forecasts, and targeted equipment to guide farm decisions',context:'farmers facing variable weather, costly inputs, soil decline, and pressure to produce food efficiently',benefit:'apply water, fertiliser, and crop protection more precisely while identifying problems earlier',risk:'high purchase costs, unreliable connectivity, unsuitable recommendations, data dependence, and loss of practical knowledge',stakeholders:'farmers, advisers, equipment firms, software platforms, cooperatives, lenders, and agricultural agencies',governance:'interoperable tools, data rights, independent advice, shared equipment, training, repair access, and locally tested recommendations',glossary:[{term:'precision agriculture',definition:'Farm management that uses detailed data to target decisions and inputs.'},{term:'interoperable',definition:'Able to exchange information and work with other systems.'}]},
  {slug:'antibiotic-stewardship',subject:'antibiotic stewardship across health systems',topic:'Global health',intervention:'coordinating diagnosis, prescribing, infection prevention, surveillance, and public guidance to protect antibiotic effectiveness',context:'rising resistance that makes common infections harder and more expensive to treat',benefit:'improve treatment decisions, reduce unnecessary exposure, and slow the development and spread of resistant organisms',risk:'delayed treatment, limited diagnostic access, informal medicine sales, weak sanitation, and rules that ignore differences between settings',stakeholders:'patients, doctors, pharmacists, veterinarians, laboratories, hospitals, farmers, and public-health agencies',governance:'rapid diagnostics, prescribing review, resistance surveillance, sanitation investment, medicine regulation, professional education, and international coordination',glossary:[{term:'antimicrobial resistance',definition:'The ability of microbes to survive medicines designed to control them.'},{term:'stewardship',definition:'Careful management intended to protect a shared resource.'}]},
  {slug:'wildfire-satellites',subject:'satellite systems for wildfire response',topic:'Disaster management',intervention:'combining satellite heat detection, weather data, ground sensors, and local reports to identify and track fires',context:'regions experiencing longer fire seasons, extreme conditions, and large areas that cannot be watched continuously from the ground',benefit:'detect some fires earlier, map changing fronts, guide resources, and improve warnings for exposed communities',risk:'cloud or smoke obstruction, false alerts, delayed data, weak local communication, and overconfidence in remote information',stakeholders:'fire crews, residents, Indigenous land managers, weather agencies, satellite providers, utilities, and emergency authorities',governance:'data-sharing standards, local verification, communication backups, public warning rules, system maintenance, and integration with land management',glossary:[{term:'remote sensing',definition:'Collecting information about an area from aircraft or satellites.'},{term:'fire front',definition:'The active edge of a spreading wildfire.'}]},
  {slug:'community-energy',subject:'community ownership of renewable energy',topic:'Energy policy',intervention:'allowing local groups to finance, own, or share revenue from solar, wind, and energy-storage projects',context:'the transition from fossil fuels and growing debate about who controls and benefits from new infrastructure',benefit:'retain income locally, strengthen support for projects, and give communities influence over energy decisions',risk:'unequal ability to invest, complex administration, financial loss, conflict over sites, and participation dominated by a small group',stakeholders:'residents, cooperatives, landowners, developers, utilities, local governments, and households facing energy poverty',governance:'inclusive membership, benefit-sharing formulas, independent advice, transparent accounts, planning safeguards, and support for low-income participation',glossary:[{term:'energy cooperative',definition:'An organisation whose members jointly own or manage energy activity.'},{term:'benefit sharing',definition:'A process for distributing gains from a project among affected groups.'}]},
]

const analyticalLenses=[
  {slug:'evidence',title:(subject:string)=>`Measuring the impact of ${subject}`,subtitle:(subject:string)=>`Why evidence about ${subject} depends on definitions, baselines, and comparison`,focus:'evidence',question:'whether reported results are comparable and genuinely caused by the intervention'},
  {slug:'equity',title:(subject:string)=>`Who benefits from ${subject}?`,subtitle:(subject:string)=>`Examining access, unequal risks, and the distributional effects of ${subject}`,focus:'equity',question:'how benefits, costs, access, and decision-making power are distributed'},
  {slug:'scale',title:(subject:string)=>`From pilot to policy: ${subject}`,subtitle:(subject:string)=>`What changes when ${subject} moves from a small trial to a public system`,focus:'implementation at scale',question:'whether an approach can expand without losing quality, affordability, or local fit'},
  {slug:'behaviour',title:(subject:string)=>`Why people respond differently to ${subject}`,subtitle:(subject:string)=>`The role of trust, incentives, routines, and institutional design in ${subject}`,focus:'human behaviour',question:'why technically available options are adopted, resisted, adapted, or abandoned'},
  {slug:'resilience',title:(subject:string)=>`Can ${subject} remain effective over time?`,subtitle:(subject:string)=>`Funding, maintenance, adaptation, and long-term accountability in ${subject}`,focus:'long-term resilience',question:'what is required to maintain performance as conditions, institutions, and technologies change'},
]

function significantTerms(value:string){return(value.toLowerCase().match(/[a-z]+/g)??[]).filter(word=>word.length>4).slice(0,3)}

function createPractice(blueprint:PracticeBlueprint,lens:typeof analyticalLenses[number]):IntegratedSummaryText{
  const terms=significantTerms(blueprint.subject)
  return{
    id:`${blueprint.slug}-${lens.slug}`,
    title:lens.title(blueprint.subject),subtitle:lens.subtitle(blueprint.subject),topic:blueprint.topic,level:'B2–C1',readingMinutes:10,sourceLabel:'MadeByAibek Academic Skills Lab · Original practice text',
    paragraphs:[
      `${blueprint.subject[0].toUpperCase()+blueprint.subject.slice(1)} has attracted attention in ${blueprint.context}. The central intervention involves ${blueprint.intervention}. Supporters often describe the approach as an obvious response to a visible problem, but its performance depends on the wider system in which it operates. Examining ${lens.focus} shifts attention from whether the idea is possible to ${lens.question}. This distinction is important because a successful demonstration does not by itself establish a durable public solution.`,
      `The proposed benefits are significant. The approach may ${blueprint.benefit}. These outcomes can reinforce one another, particularly when organisations coordinate investment and share information. Nevertheless, benefits should be defined before a project begins. A narrow measure can make performance appear strong while overlooking effects on service quality, labour, households, or the environment. Clear goals allow researchers and communities to distinguish genuine improvement from activity that is merely easy to count.`,
      `Evidence must be interpreted carefully. Projects frequently begin in places with strong leadership, additional funding, and participants who are already interested, so their outcomes may not represent ordinary conditions. Before-and-after results can also confuse the effect of the intervention with economic, seasonal, or demographic change. Useful evaluation combines a credible baseline, comparison groups where possible, quantitative data, and qualitative evidence explaining how people experienced the programme. Negative and uneven outcomes are as informative as average success.`,
      `Several constraints may reduce or reverse the expected gains. Important risks include ${blueprint.risk}. Some problems can be addressed through improved design, while others reflect unavoidable trade-offs between competing goals. Decision-makers should identify who carries each risk, whether problems appear immediately or after several years, and whether costs have simply moved to another organisation or location. Ignoring unintended consequences during a pilot makes later expansion more expensive and politically difficult.`,
      `The relevant stakeholders include ${blueprint.stakeholders}. They do not enter the process with equal resources or authority. A convenient system for one group may create extra work, expense, or surveillance for another. Formal consultation is insufficient if technical language, inaccessible meetings, or short deadlines prevent meaningful participation. Equity requires attention to who can use the intervention, who can influence it, and who has a realistic route to challenge decisions or obtain a non-digital alternative.`,
      `Implementation depends on institutions rather than technology alone. Necessary governance may include ${blueprint.governance}. Stable funding must cover maintenance, staff, training, evaluation, and replacement rather than only initial equipment. Responsibilities should remain clear when contractors change or an emergency occurs. Public reporting can strengthen accountability, but indicators need context: high participation, for example, does not prove that outcomes are fair, effective, or better than available alternatives.`,
      `A balanced assessment of ${blueprint.subject} therefore connects technical performance with evidence, behaviour, equity, and long-term governance. The intervention may produce valuable benefits, but only when goals are explicit, data is comparable, risks are acknowledged, and affected groups have influence. Policy should support continued evaluation and adaptation instead of declaring permanent success after an early trial. The most credible approach is not automatic expansion or rejection, but responsible implementation that can learn from varied results.`
    ],
    glossary:[...blueprint.glossary,{term:'baseline',definition:'A starting measurement used to judge later change.'},{term:'accountability',definition:'Responsibility for decisions and an obligation to explain their results.'}],
    keyPoints:[
      {label:'The intervention must be assessed within its wider system.',keywords:[...terms,'system','intervention']},
      {label:'Benefits require explicit definitions and broad outcome measures.',keywords:['benefits','outcomes','goals','quality','improvement']},
      {label:'Reliable evidence needs baselines, comparisons, and varied data.',keywords:['evidence','baseline','comparison','quantitative','qualitative']},
      {label:'Risks and trade-offs may shift costs or appear over time.',keywords:['risks','trade-offs','costs','unintended','constraints']},
      {label:'Stakeholder power and equitable access must be considered.',keywords:['stakeholders','equity','participation','authority','access']},
      {label:'Long-term implementation requires governance, funding, and accountability.',keywords:['governance','funding','maintenance','accountability','adaptation']},
    ],
  }
}

const generatedIntegratedSummaryTexts=practiceBlueprints.flatMap(blueprint=>analyticalLenses.map(lens=>createPractice(blueprint,lens)))

function sourceExtension(text:IntegratedSummaryText,index:number){
  const point=text.keyPoints[index%text.keyPoints.length]
  const related=text.keyPoints[(index+1)%text.keyPoints.length]
  const terms=point.keywords.slice(0,3).join(', ')
  const subject=text.title.toLowerCase()
  const extensions=[
    `A closer examination of this ${text.topic.toLowerCase()} debate shows why ${subject} cannot be understood as a single technical choice. The relationship between ${terms} develops across institutions and over time, so a result observed in one location may not transfer directly to another. Historical investment, local capacity, and existing rules shape both the problem and the range of realistic responses. This wider context helps distinguish a promising idea from an intervention that can produce reliable public value under ordinary conditions.`,
    `Assessing these proposed gains also requires a clear account of what improvement means and whose experience is being measured. Indicators linked to ${terms} may show immediate progress while missing indirect costs, delayed effects, or changes in quality. Researchers therefore need several measures rather than one convenient headline figure. They should also state the period of evaluation and the alternative against which results are compared, because an intervention can appear successful in isolation while performing no better than a less expensive or more accessible option.`,
    `The evidence base becomes stronger when numerical trends are interpreted alongside the mechanisms that produced them. Data concerning ${terms} can identify patterns, but interviews, observation, and local records often explain why those patterns differ between groups or places. Studies should report uncertainty, missing data, and unsuccessful cases instead of presenting only average outcomes. This matters because ${related.label.charAt(0).toLowerCase()+related.label.slice(1)} Evidence that includes variation is more useful for policy than a single estimate detached from the conditions in which it was produced.`,
    `Trade-offs are especially important when decisions affect several systems at once. Changes involving ${terms} may solve one visible difficulty while shifting expense, labour, or environmental pressure elsewhere. Some consequences appear quickly, whereas others emerge only after equipment ages, funding ends, or participation changes. Scenario analysis can help decision-makers compare these pathways and identify thresholds at which benefits begin to decline. It can also reveal whether a reversible trial is appropriate or whether early choices will create infrastructure and contracts that are difficult to change later.`,
    `Distributional questions add another layer to the assessment. Access to information, time, finance, and decision-making power influences who can benefit from arrangements involving ${terms}. Groups described as stakeholders are not automatically represented simply because a consultation meeting occurs. Participation must be accessible, early enough to shape the proposal, and connected to a visible response from decision-makers. Monitoring should then separate outcomes by relevant population and place, since a positive average can coexist with serious disadvantages for people who already face the greatest barriers.`,
    `Long-term delivery depends on routine institutional work that pilot projects often understate. Systems connected with ${terms} require trained staff, maintenance schedules, secure funding, data standards, and a clear process for correcting failures. Contracts should specify responsibility after suppliers change, while public reporting should explain performance in language that affected communities can use. Independent review is valuable when organisations have incentives to emphasise success. Without these arrangements, an effective early programme may weaken gradually even though the technology or policy continues to exist in name.`,
    `For this reason, the central lesson is not that ${subject} should always be expanded or rejected. It is that decisions should connect ${terms} with the broader concerns identified throughout the source. Authorities need explicit objectives, comparable evidence, safeguards for affected groups, and opportunities to revise implementation as conditions change. Periodic evaluation should examine both intended results and unexpected consequences. Such an adaptive approach treats uncertainty as a reason for careful learning and accountability, rather than as an excuse either for permanent delay or for unsupported claims of success.`,
  ]
  return extensions[index%extensions.length]
}

function expandSourceText(text:IntegratedSummaryText):IntegratedSummaryText{
  return{
    ...text,
    readingMinutes:text.readingMinutes*2,
    paragraphs:text.paragraphs.map((paragraph,index)=>`${paragraph} ${sourceExtension(text,index)}`),
  }
}

export const integratedSummaryTexts:IntegratedSummaryText[]=[...coreIntegratedSummaryTexts,...generatedIntegratedSummaryTexts].map(expandSourceText)

const words=(value:string)=>(value.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g)??[])
const sentences=(value:string)=>value.trim().split(/(?<=[.!?])\s+/).filter(Boolean)
const band=(score:number,max:number):RubricCriterion['band']=>{
  if(score===0)return'Insufficient sample'
  if(score/max<=.4)return'Weak'
  if(score/max<=.7)return'Satisfactory'
  if(score/max<1)return'Good'
  return'Excellent'
}
const criterion=(score:number,maximum:number,feedback:string):RubricCriterion=>({score,maximum,band:band(score,maximum),feedback})

export function copiedPercentage(answer:string,source:string){
  const responseWords=words(answer);const sourceText=` ${words(source).join(' ')} `
  if(responseWords.length<5)return 0
  let copied=0
  for(let index=0;index<=responseWords.length-5;index++)if(sourceText.includes(` ${responseWords.slice(index,index+5).join(' ')} `))copied++
  return Math.round(copied/(responseWords.length-4)*100)
}

function improvedSummaryFor(passage:IntegratedSummaryText){
  const connectors=['First','The text also explains','In addition','However, it emphasises','From a wider perspective, it shows','Finally, the discussion argues']
  const extensions=['and presents this as a central condition for understanding the topic','which connects the expected benefits with practical limitations','and demonstrates why a narrow technical account would be incomplete','while identifying trade-offs that decision-makers must address','and links individual experiences to institutional responsibilities','which supports a balanced rather than absolute conclusion']
  const points=passage.keyPoints.map((point,index)=>{
    const idea=point.label.replace(/[.!?]+$/,'')
    const lowered=idea[0].toLowerCase()+idea.slice(1)
    return `${connectors[index]??'Furthermore'}, ${lowered}, ${extensions[index]??'and relates this idea to the text’s overall argument'}.`
  })
  return `The source text examines ${passage.title.toLowerCase()}, with particular attention to ${passage.subtitle.toLowerCase()}. ${points.join(' ')} Overall, the text concludes that the issue cannot be addressed through one isolated measure; effective action depends on combining sound evidence, appropriate implementation, and continuing attention to the people and systems affected.`
}

function locateMainIdeas(passage:IntegratedSummaryText){
  return passage.keyPoints.map(point=>{
    let paragraphIndex=0,highest=-1
    passage.paragraphs.forEach((paragraph,index)=>{const normalized=paragraph.toLowerCase();const hits=point.keywords.filter(keyword=>normalized.includes(keyword.toLowerCase())).length;if(hits>highest){highest=hits;paragraphIndex=index}})
    return{label:point.label,paragraphIndex,keywords:point.keywords}
  })
}

function annotateSummary(answer:string,source:string,topicSentence:boolean,conclusion:boolean){
  const annotations:IntegratedSummaryResult['annotations']=[]
  const add=(start:number,end:number,type:IntegratedSummaryResult['annotations'][number]['type'],message:string)=>{
    if(start<0||end<=start||annotations.some(item=>start<item.end&&end>item.start))return
    annotations.push({start,end,type,message})
  }
  const sentenceMatches=[...answer.matchAll(/[^.!?]+[.!?]?/g)].filter(match=>match[0].trim())
  for(const match of sentenceMatches){const start=match.index??0,end=start+match[0].length,text=match[0].trim();if(words(text).length>=8&&copiedPercentage(text,source)>=45)add(start,end,'source-use','This sentence closely follows the source. Paraphrase its meaning with a different structure and vocabulary.')}
  for(const match of answer.matchAll(/\b(i think|i believe|in my opinion|in my view|we should)\b/gi)){const start=match.index??0;add(start,start+match[0].length,'opinion','Remove personal opinion. An IS summary reports only the source writer’s ideas.')}
  for(const match of answer.matchAll(/\b(people is|they is|informations|this show|these is|depend of|more better|should to)\b/gi)){const start=match.index??0;add(start,start+match[0].length,'language','Review the grammar or word form in this highlighted phrase.')}
  for(const match of sentenceMatches){if(words(match[0]).length>40){const start=match.index??0;add(start,start+match[0].length,'language','This sentence is very long. Divide or restructure it to make the relationship between ideas clearer.')}}
  const first=sentenceMatches[0],last=sentenceMatches.at(-1)
  if(!topicSentence&&first){const start=first.index??0;add(start,start+first[0].length,'organization','Strengthen the topic sentence so it identifies the source topic and overall focus.')}
  if(!conclusion&&last){const start=last.index??0;add(start,start+last[0].length,'organization','Turn the final sentence into a concise conclusion that restates the source’s overall message.')}
  return annotations.sort((a,b)=>a.start-b.start)
}

export function evaluateIntegratedSummary(passage:IntegratedSummaryText,answer:string):IntegratedSummaryResult{
  const responseWords=words(answer);const wordCount=responseWords.length;const paragraphCount=answer.trim()?answer.trim().split(/\n\s*\n/).filter(Boolean).length:0
  const normalized=answer.toLowerCase();const responseSentences=sentences(answer);const copiedPercent=copiedPercentage(answer,passage.paragraphs.join(' '))
  const covered=passage.keyPoints.filter(point=>point.keywords.filter(keyword=>normalized.includes(keyword)).length>=2).length
  const coverage=covered/passage.keyPoints.length
  let taskScore=coverage>=.9?20:coverage>=.65?17:coverage>=.4?14:coverage>0?8:0
  const flags:string[]=[]
  if(wordCount<150||wordCount>250){taskScore=Math.min(taskScore,14);flags.push(`The response is ${wordCount<150?'under':'over'} the 150–250 word limit.`)}
  if(paragraphCount!==1){taskScore=Math.min(taskScore,14);flags.push('The response must be written as one paragraph.')}
  if(/\b(i think|i believe|in my opinion|in my view|we should)\b/i.test(answer)){taskScore=Math.min(taskScore,14);flags.push('Personal opinion was detected; the task requires only the source ideas.')}
  if(copiedPercent>=50){taskScore=Math.min(taskScore,8);flags.push('At least half of the response closely matches the source, so the Task Achievement ceiling is 8.')}
  const first=responseSentences[0]??'',last=responseSentences.at(-1)??''
  const topicSentence=words(first).length>=8&&passage.title.toLowerCase().split(/\W+/).filter(word=>word.length>4).some(word=>first.toLowerCase().includes(word))
  const conclusion=/\b(overall|in conclusion|ultimately|therefore|together|in summary|thus)\b/i.test(last)||responseSentences.length>2&&words(last).length>=8
  const connectors=(answer.match(/\b(however|therefore|moreover|furthermore|while|whereas|although|because|consequently|in addition|for this reason|yet|also)\b/gi)??[]).length
  const elements=[topicSentence,coverage>=.4,conclusion].filter(Boolean).length
  let organizationScore=elements===3&&connectors>=2?10:elements===3?8.5:elements===2?7:elements===1?4:0
  if(paragraphCount!==1)organizationScore=Math.min(organizationScore,7)
  const uniqueRatio=new Set(responseWords).size/Math.max(1,responseWords.length)
  const academicTerms=(answer.match(/\b(significant|factor|consequence|approach|evidence|policy|however|therefore|whereas|although|effective|requires|contributes|indicates|demonstrates|overall)\b/gi)??[]).length
  const errors=(answer.match(/\b(people is|they is|informations|this show|these is|depend of|more better|should to)\b/gi)??[]).length
  let languageScore=errors===0&&uniqueRatio>=.48&&academicTerms>=3?10:errors<=1&&uniqueRatio>=.4?8.5:errors<=3?7:responseWords.length?4:0
  if(copiedPercent>=50)languageScore=Math.min(languageScore,4)
  const taskFeedback=`The summary covers ${covered} of ${passage.keyPoints.length} main ideas${taskScore===20?' without unnecessary detail.':'. Review the source for missing central points.'}`
  const organizationFeedback=elements===3?`A topic sentence, ordered main-idea development, and a conclusion are present${connectors>=2?', with effective links between ideas.':', but cohesion could be clearer.'}`:`The response includes ${elements} of the required structural elements: topic sentence, main-idea development, and conclusion.`
  const languageFeedback=languageScore>=8.5?'The language is academically appropriate, varied, and generally accurate, with effective paraphrasing.':languageScore>=7?'The meaning is generally clear, but range, accuracy, or paraphrasing is inconsistent.':'Language range, accuracy, and paraphrasing need substantial development.'
  const rubric={taskAchievement:criterion(taskScore,20,taskFeedback),organization:criterion(organizationScore,10,organizationFeedback),language:criterion(languageScore,10,languageFeedback)}
  const total=taskScore+organizationScore+languageScore
  const strengths=[coverage>=.65?'Most central ideas are represented.':'The response engages with the source topic.',topicSentence?'The opening identifies the source topic.':'The response attempts to synthesize source information.',connectors>=2?'Ideas are connected with cohesive language.':'A complete summary draft was submitted.']
  const nextSteps:string[]=[]
  if(coverage<.9)nextSteps.push('Add the missing main ideas and remove supporting details that do not represent the whole text.')
  if(!topicSentence)nextSteps.push('Open with one sentence that identifies the text’s overall topic and central focus.')
  if(!conclusion)nextSteps.push('End with a concise concluding sentence that restates the overall message without adding an opinion.')
  if(connectors<2)nextSteps.push('Use a small range of logical connectors to show contrast, cause, and addition.')
  if(languageScore<8.5)nextSteps.push('Paraphrase with academically appropriate vocabulary and check sentence-level accuracy.')
  const criterionNames:{key:keyof typeof rubric;label:string}[]=[{key:'taskAchievement',label:'Task Achievement'},{key:'organization',label:'Organization'},{key:'language',label:'Language'}]
  const weakest=criterionNames.sort((a,b)=>rubric[a.key].score/rubric[a.key].maximum-rubric[b.key].score/rubric[b.key].maximum)[0]
  const feedback=total>=34?`This is a strong response with clear control of the task. Your best next improvement is in ${weakest.label.toLowerCase()}: ${rubric[weakest.key].feedback}`:total>=25?`You have produced a workable summary, but it is not yet consistently effective. Focus first on ${weakest.label.toLowerCase()}: ${rubric[weakest.key].feedback}`:`Your response shows an initial understanding of the task, but substantial revision is needed. Begin with ${weakest.label.toLowerCase()}: ${rubric[weakest.key].feedback}`
  return{total,maximum:40,percent:Math.round(total/40*100),wordCount,paragraphCount,copiedPercent,rubric,strengths:strengths.slice(0,3),nextSteps:nextSteps.slice(0,4),flags,feedback,improvedSummary:improvedSummaryFor(passage),annotations:annotateSummary(answer,passage.paragraphs.join(' '),topicSentence,conclusion),mainIdeas:locateMainIdeas(passage),evaluationMode:'deterministic'}
}

export function publicIntegratedSummaryTexts(){return integratedSummaryTexts.map(({keyPoints,...text})=>text)}
