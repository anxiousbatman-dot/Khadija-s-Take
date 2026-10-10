// Edit your site details here. They update on every page.
// Images: put your files in the "images" folder (see images/README.txt).
const SITE = {
  name: "Khadija's Take",
  tagline: "",   // the text under the banner (left empty on purpose)
  // Introduction card on the Home page (your picture, your names and your text).
  aboutName: "Khadija",
  aboutNickname: "Douja",   // leave "" to hide the "You can call me" line
  aboutPicture: "images/my-picture.jpg",   // your picture; until it exists, a "my picture" box shows
  // Your introduction. Each new line becomes its own paragraph.
  about: `hello!! i'm khadija, a 21 year old student-artist at ISG-T, passionate about everything artistic, creative and social.
i focus on giving my personal takes and views and political and social matters espacially in tunisia. i love sharing my takes and learning more about diffrent opinions.
if you're intrested in art or social issues make sure to follow my blog to hear my takes and share yours.`,
  adminEmail: "kadija0boughanmi@gmail.com",   // the Google account that can delete any comment
  firebase: {   // paste your Firebase values here to turn on comments
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  },
  // Playlists box in the left column. "image" is the small picture next to each name.
  playlists: [
    { name: "Angry Women", url: "https://open.spotify.com/playlist/6F8Ivq4pqo7LdGVRnNSO2x?si=teVgjIkpTvqod6-XRGMNqg", image: "images/angry-women.jpg" }
    { name: "Bachatita", url: "https://open.spotify.com/playlist/2W0wd86QF26BRwEwhRvABw?si=WCRKdV6xQnOJ9A14zTH-Lw", image: "images/bachatita.jpg" },
    { name: "U Broke Me", url: "https://open.spotify.com/playlist/51vUopN4RlUP8GcgTXXI88?si=stON20mGS3uAd8jlnUG1MQ", image: "images/u-broke-me.jpg" },

  ],
  links: [
    { text: "Email", url: "mailto:kadija0boughanmi@gmail.com" },
    { text: "Youtube", url: "https://www.youtube.com/@Anxious_batman" },
    { text: "Tiktok", url: "https://www.tiktok.com/@kkhhaaddiijjaa3?_r=1&_t=ZS-9AHR7cq6YGS" },
    { text: "LinkedIn", url: "https://www.linkedin.com/in/khadija-boughanmi-a11036332/" }
  ]
};

// To add a post, copy one block and give it a unique slug.
// "category" decides which section it appears in: articles, art or daily-life.
// Posts show on the site in the same order as here: the first one in the list is on top.
// "image" is optional: a small picture shown next to the summary (leave it out or "" for none).
// "body": write plain text (each line becomes a paragraph) or HTML (<p>, <h2>, <ul>, <img>, <a>).
const POSTS = [
  {
    slug: "Yakin-case",
    title: "Yakin’s Case and the Illusion of the Perfect Victim",
    date: "2026-10-04",
    category: "articles",   // articles, art or daily-life
    image: "",
    summary: "My opinions on the yakin case",
    body: `
<p dir="auto">There’s a case in Tunisia similar to Jane Doe at Cornell University. Her name is Yakin. A 15-year-old girl was raped by 7 to 11 guys. The initial coverage was that she asked her mother to meet a friend in a coffee shop next to her home, and she was tricked by said friend when she went and was drugged and taken to the men to rape her.</p>

<p dir="auto">Later on people started digging into her past, pulling up videos of her in crop tops and clothes too short by their standards, and deemed inappropriate, and more than that, it is alleged that her friend went with her to meet her boyfriend but left early because she saw Yakin being too lovey-dovey with her boyfriend and she was uncomfortable.</p>

<p dir="auto">Later on it’s circulating that Yakin consumed drugs until unconsciousness. After that, she was brutally raped by 7 to 11 guys for two days. In that period, her mother alleged that she received a call from the guy telling her, "I am raping your daughter, and I will rape you and your mother," and as of today Five people have been arrested in connection with the kidnapping and sexual assault.</p>

<p dir="auto">While the initial reception was widespread rage and people calling for the men’s execution, everyone was on Yakin's side; it was the perfect victim who was tricked by her friend, but after the new information came out, she was no longer this perfect victim; she was no longer the poor girl, she became the girl who may have deserved what happened to her.</p>

<p dir="auto">People started switching sides; their conditional empathy started weavering. They started saying, "Oh, maybe she shouldn't have gone there," or "Why does she have a boyfriend or piercings?" Men started asking for her mother’s execution and even her own. They forgot about the men who raped a 15-year-old girl; the 15-year-old became the one under scrutiny and public rage.</p>

<p dir="auto">Men started complaining about how when the initial story was out, everyone was demanding the guys’ execution, but when the new information was revealed, everyone was asking to hide her identity and not speak ill of her chastity, but what these men don't understand is that her dressing "inappropriately" or cussing or having piercings doesn't harm anybody; it’s just a personal choice, her own personal choice, and whether it's a sin or not, it’s between her and Allah, rape however does greatly affects its victim.</p>

<p dir="auto">They didn't stop at that; they made it their mission to insult everyone, men and women, who decided to even try to defend Yakin or side with her. Predictably, they pulled out the "what if the roles were reversed?" card, but when faced with the fact that female rapists would face the exact same treatment, they pivoted to claiming that "a man would enjoy it." In doing so, their rhetoric stopped harming only female victims and began invalidating male victims as well. Some even took to TikTok to make edits of Yakin’s boyfriend, one of the men involved in the rape case, and started crushing on him to songs like "Mama, I'm in Love with a Criminal." Which shows that not only are men being rape apologists, but women are complacent as well.</p>

<p dir="auto">The girl is 15 years old; she is bedridden and in the hospital. Her identity is now public; she won't be able to go anywhere, meet new people, or probably get married in this society that blames women victims and uses religion to further victimize them. Here, this story revealed that maybe "it's the minority of men who commit these crimes" is, after all, a lie, because social media comment sections and posts revealed that most men find it very easy to justify rape and violence against women and find men who condemn it not men enough.</p>

<p dir="auto">They use religion to fault her while they themselves don't practice the religion they preach.</p>

<p dir="auto">Morally, rape is wrong, and I hope we can all agree.</p>

<p dir="auto">Religiously, it's also wrong, and the victim is not to blame.</p>

<p dir="auto">وَمَنْ يُكْرِهْهُنَّ فَإِنَّ اللَّهَ مِنْ بَعْدِ إِكْرَاهِهِنَّ غَفُورٌ رَحِيمٌ</p>

<p dir="auto">"But if someone coerces them, then after their coercion, Allah is indeed All-Forgiving, Most Merciful [to the victim]." — Surah An-Nur 24:33</p>

<p dir="auto">But most went ahead and started shaming her for her sins and forgot the rape itself and what Allah said about accusing a woman’s chastity:</p>

<p dir="auto">وَالَّذِينَ يَرْمُونَ الْمُحْصَنَاتِ ثُمَّ لَمْ يَأْتُوا بِأَرْبَعَةِ شُهَدَاءَ فَاجْلِدُوهُمْ ثَمَانِينَ جَلْدَةً وَلَا تَقْبَلُوا لَهُمْ شَهَادَةً أَبَدًا ۚ وَأُولَٰئِكَ هُمُ الْفَاسِقُونَ</p>

<p dir="auto">"And those who accuse chaste women and then do not produce four witnesses—lash them with eighty lashes and do not accept their testimony ever after. And those are the defiantly disobedient." — Surah An-Nur 24:4</p>

<p dir="auto">If they deny her being a chaste woman,</p>

<p dir="auto">إِنَّ بَعْضَ الظَّنِّ إِثْمٌ</p>

<p dir="auto">"Indeed, some suspicion is a sin." — Surah Al-Hujurat, 49:12</p>

<p dir="auto">So I would like to remind these people to not cast suspicion on her nor accuse her of anything because you don't know her.</p>

<p dir="auto">And Allah is merciful and forgiven:</p>

<p dir="auto">قُلۡ يَٰعِبَادِيَ ٱلَّذِينَ أَسۡرَفُواْ عَلَىٰٓ أَنفُسِهِمۡ لَا تَقۡنَطُواْ مِن رَّحۡمَةِ ٱللَّهِۚ إِنَّ ٱللَّهَ يَغۡفِرُ ٱلذُّنُوبَ جَمِيعًاۚ إِنَّهُۥ هُوَ ٱلۡغَفُورُ ٱلرَّحِيمُ</p>

<p dir="auto">"Say, 'O My servants who have transgressed against themselves [committed excessive sins], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.” — Surah Az-Zumar, 39:53</p>

<p dir="auto">So if Allah can forgive her, who are you to deny people mercy or remind them of their sins?</p>

<p dir="auto">إِنَّ ٱلَّذِينَ يُحِبُّونَ أَن تَشِيعَ ٱلْفَـٰحِشَةُ فِى ٱلَّذِينَ ءَامَنُوا۟ لَهُمْ عَذَابٌ أَلِيمٌ فِى ٱلدُّنْيَا وَٱلْـَٔاخِرَةِ ۚ وَٱللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ ١٩</p>

<p dir="auto">"Indeed, those who like that immorality should be spread among those who have believed will have a painful punishment in this world and the Hereafter. And Allah knows, and you do not know."</p>

<p dir="auto">The real sin is the arrogance and feeling superior to her because they think they are better Muslims than her, which in itself is a huge sin, the very same arrogance of pride and self-righteousness that got Iblis himself cast out of Allah’s mercy:</p>

<p dir="auto">قَالَ أَنَا خَيْرٌ مِّنْهُ خَلَقْتَنِي مِن نَّارٍ وَخَلَقْتَهُ مِن طِينٍ</p>

<p dir="auto">“He said, 'I am better than him. You created me from fire and created him from clay.’” — Surah Al-A'raf, 7:12</p>

<p dir="auto">By looking down on a victim with unearned moral superiority, they are repeating the oldest sin in existence.</p>

<p dir="auto">As we establish that rape is morally wrong and religiously wrong, accusing her and doubting her chastity is also religiously wrong; we can look at the law.</p>

<p dir="auto">Even in law it is wrong to rape someone against their consent. Tunisia strictly criminalizes rape under its Penal Code and strengthened protections through the landmark Law on Eliminating Violence against Women (Law No. 58 of 2017). Under Tunisian law, any sexual act with a person under the age of 16 is legally defined as rape because consent is considered non-existent.</p>

<p dir="auto">Morally the men were wrong, religiously they’re also wrong, and lawfully they are criminal, so why are we as a society still discussing “her fault," the fault of a 15-year-old? Even if she had consented to sexual activity before, even if she consented to sexual activity with one, two, or three of them, she is 15. Would she still have consented to being kidnapped for two days and being raped until she can't even stand? I highly doubt that.</p>

<p dir="auto">And this case didn't just affect Yakin; it showed the deep-rooted flaws and misogyny in Tunisian society, and it made women scared for themselves and their safety because if society can justify a rape of a teenager by 7 men, what is stopping them from justifying other forms of rape in Tunisia?</p>

<p dir="auto">Tahar Haddad’s Tunisia: The country of intellectual reformer Tahar Haddad, who published Our Women in the Sharia and Society, arguing for women's education, employment, and the reform of marriage laws, which laid the intellectual cornerstone for modern Tunisian feminism.</p>

<p dir="auto">Union of Muslim Women’s Tunisia: The first organized Muslim women's association in Tunisia, combining nationalist resistance against French colonialism with early demands for women's rights and education.</p>

<p dir="auto">The Personal Status Code of Tunisia: That abolished polygamy, outlawed unilateral repudiation, established judicial divorce, and set a minimum marriage age.</p>

<p dir="auto">National Union of Tunisian Women: The official state-feminism arm, driving literacy campaigns and promoting women's civic integration.</p>

<p dir="auto">Legislative Victories Tunisia: Constitution's equality guarantees, the repeal of the "marry-your-rapist" law (Article 227) in 2017, and the 2017 Law on Eliminating Violence Against Women, while continuing campaigns for equal inheritance rights.</p>

<p dir="auto">And much, much more, and despite that today in Tunisia marital rape isn't even being considered, men feel entitled to women’s body, harassment is more normalized than ever and men decide to protest Tunisian women’s rights.</p>

<p dir="auto">Yakin is not the first victim nor the only victim and won't be the only victim, and I won't try to make you understand that by asking you to imagine you female family members in Yakin's position because as a society we should be able to empathize without conditions or having to put ourselves in the shoes of the person.</p>

<p dir="auto">This isn't only about what happened to Yakin; this is about what the sentencing will mean to every woman who lives in Tunisia. Yakin deserves justice no matter what her background is, no matter who her parents are, and no matter what she consumes or wears or says; she is a child that needs protection, and rape is only the rapist's fault.</p>

<p dir="auto">And lastly, women, you could be a yakin someday and act however you want others to act when you’re the victim. You’re not immune to rape; veiled or unveiled, men or women, none unfortunately is.</p>
`
  },
  {
    slug: "racism-repackaged-as-patriotism",
    title: "Racism Re-packaged as Patriotism",
    date: "2026-10-10",
    category: "articles",   // articles, art or daily-life
    image: "",
    summary: "My opinion on racism in Tunisia and how it hides behind the excuse of protecting the country.",
    body: `
<p dir="auto">Tunisia, just like many other countries, is unfortunately full of racists using the same excuses being parroted to cover their racist actions by hiding behind “protecting our country.” Though these racists didn't stop at being racist, having judgment, and using nasty language, they went further than that.</p>

<p dir="auto">They turned to protesting immigrant children’s rights for education, a basic human right. They went out on the street ignoring the very real and damaging tragedies and issues the country is facing and protesting children going to school, then even gave signs to their children, making kids who understand nothing of the matter participate in these racist protests in schools, and that does that tell you about what kind of children they’re raising. It also raises the question of if what bothers them about Black undocumented immigrants is the crimes they commit, wouldn't getting them an education reduce the crimes amongst them and could be beneficial for everyone?</p>

<p dir="auto">Regardless of laws and citizenship status These children have the right to get educated; they have the right to a fair chance in life, and who are we to deny them that? They have birthright citizenship, and under Article 1 of the Education Law n° 2002-80 (enacted on July 23, 2002), education is explicitly designated as a "supreme national priority." It states that school attendance is strictly compulsory for all children from age 6 to age 16, and parents or legal guardians who fail to register their school-aged children or withdraw them prematurely can face financial fines.</p>

<p dir="auto">So if the law permits it, why don't you? What threat does a child pose to your country just because their parents are undocumented immigrants?</p>

<p dir="auto">These same people are also in comment sections and social media cursing these undocumented immigrants and documented ones alike and their families, urging for their deportation. Some even attacked random Black people on the streets, even other Tunisians with darker skin tones.</p>

<p dir="auto">These people don’t see the irony of their actions, because some of them were or even are still undocumented immigrants in European countries themselves. The same people who complain about racism [abroad] are inflicting it on other immigrants to continue the vicious cycle, the unbreakable cycle of looking down on each other, thinking “we’re different,” “we’re better,” or ”we’re more civilized.” When in reality, Europeans see them the exact same way they see these Black “undocumented” immigrants. And when you use this argument, they refuse to acknowledge they’re even remotely comparable.</p>

<p dir="auto">These people are not actually protecting their country; their hate doesn't come from patriotism, they’re just being racist and refusing to admit it.</p>

<p dir="auto">We could ask ourselves, why does it not bother them when the immigrant is white? Why are white relationships outside of marriage accepted and normalized when renting a place together in an apartment or hotel, but if it’s a Black couple, it’s outrageous and unacceptable in a “Muslim country," which Tunisia is not even a Muslim country; it’s a civil state.</p>

<p dir="auto">And we could also ask: in April 2026, why did they immediately jump to believing The homeowner of the apartment in the Aouina’s recorded video, capturing her confronting a sub-Saharan African immigrant sleeping in her bed, who replied to "What are you doing in my house? Who are you?"  by "I'm sorry... I was tired and just wanted to sleep," but immediately denied the allegedly filmed rape of a Black woman by her rapists, who are Tunisian. Why were there not nearly as many articles or posts about the second case, and why did we let a grown man, a representative of the people in the Assembly of the Representatives of the People, get away with saying, “A Black woman getting raped? That doesn't happen. There are plenty of beautiful Tunisian girls, Mshallah. Honestly, it breaks my heart to even have to say that; we’re not lacking. Tunisia has everything." Why do we have this bias? Is it because they’re undocumented or just because they’re Black?</p>

<p dir="auto">Racism and colorism go hand in hand. In my opinion, these beliefs do not come from nothing; they stem from colonialism that built global social hierarchies that linked lighter skin to power, status, and morality, while treating darker skin as inferior, the working class, and the poor. This shows up in different fonts in different countries depending on the culture, not just in Tunisia. Colorism is one of the subtle ways racism is being practiced alongside using slurs and referring to Black people by these heavy-weight words that caused harm to these groups for a long time, refusing to acknowledge the concept of a slur and its impact. This type of extreme racism is mostly among the older generation.</p>

<p dir="auto">Though the younger generation today isn't exempt from it themselves. Even those who are being vocal about the racism are participating in it. An example that is incredibly normalized today is saying the n-word in songs or just in conversations or even using a "Blackcent," all done “not to cause any harm." thinking being an “ally” gives them a pass for that behavior, or being North African makes them African enough to say that even though they’re not dark-skinned nor african-american nor have they faced the discrimination Black people face today.</p>

<p dir="auto">Lastly, racism can show in different ways, and the first step to combat it is looking for it within yourself first. Confront your biases and judgments before confronting others, and most importantly, by not being a bystander. If you see someone being racist, take action: stop them, talk to them, or at least pull the victim away to give them a window to get out of an awkward situation. To be an ally means you have to take action and speak up.</p>
`
  }
];
