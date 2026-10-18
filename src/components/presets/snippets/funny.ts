import { Snippet } from "./types";

export const funnySnippets: Snippet[] = [
  {
    id: "funny-crush",
    name: "Crush",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "crush.ts",
        code: 'const me = { heart: "yours" };\n\nif (you.love(me)) {\n  life = "good";\n  me.smile();\n} else {\n  cry.silently();\n  pretend.imFine();\n}',
      },
      Python: {
        fileName: "crush.py",
        code: 'me = {"heart": "yours"}\n\nif you.loves(me):\n    life = "good"\n    me.smile()\nelse:\n    cry.silently()\n    pretend.im_fine()',
      },
      Rust: {
        fileName: "crush.rs",
        code: 'let me = Heart::new("yours");\n\nif you.loves(&me) {\n    life = "good";\n    me.smile();\n} else {\n    cry::silently();\n    pretend::im_fine();\n}',
      },
      Go: {
        fileName: "crush.go",
        code: 'me := Person{Heart: "yours"}\n\nif you.Loves(me) {\n    life = "good"\n    me.Smile()\n} else {\n    cry.Silently()\n    pretend.ImFine()\n}',
      },
      Java: {
        fileName: "Crush.java",
        code: 'void main() {\n    var me = new Person("yours");\n    if (you.loves(me)) {\n        me.smile();\n    } else {\n        cry.silently();\n        pretend.imFine();\n    }\n}',
      },
      Swift: {
        fileName: "Crush.swift",
        code: 'let me = Person(heart: "yours")\n\nif you.loves(me) {\n    life = "good"\n    me.smile()\n} else {\n    cry.silently()\n    pretend.imFine()\n}',
      },
    },
  },
  {
    id: "situationship",
    name: "Situationship",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "us.ts",
        code: 'type Us = Maybe<Relationship>;\n\nasync function talk(you: Person) {\n  await you.reply({ delay: 48 * HOUR });\n  return you.isOnline ? "hey" : undefined;\n}\n\nconst label: Us = "it\'s complicated";',
      },
      Python: {
        fileName: "us.py",
        code: 'Us = Optional[Relationship]\n\nasync def talk(you: Person) -> Us:\n    await you.reply(delay=48 * HOUR)\n    return "hey" if you.is_online else None\n\nlabel: Us = "it\'s complicated"',
      },
      Rust: {
        fileName: "us.rs",
        code: 'type Us = Option<Relationship>;\n\nasync fn talk(you: &Person) -> Us {\n    you.reply(Delay::hours(48)).await;\n    you.is_online.then(Relationship::hey)\n}\n\nlet label = "it\'s complicated";',
      },
      Go: {
        fileName: "us.go",
        code: 'type Us = *Relationship\n\nfunc Talk(you Person) Us {\n    you.Reply(48 * time.Hour)\n    return you.MaybeSay("hey")\n}\n\nvar label = "it\'s complicated"',
      },
      Java: {
        fileName: "Us.java",
        code: 'void main() {\n    var us = Optional.<Relationship>empty();\n    you.reply(Duration.ofHours(48));\n    if (you.isOnline()) {\n        us = Optional.of(you.say("hey"));\n    }\n    var label = "it\'s complicated";\n}',
      },
      Swift: {
        fileName: "Us.swift",
        code: 'typealias Us = Relationship?\n\nfunc talk(_ you: Person) async -> Us {\n    await you.reply(after: .hours(48))\n    return you.isOnline ? "hey" : nil\n}\n\nlet label: Us = "it\'s complicated"',
      },
    },
  },
  {
    id: "works-on-my-machine",
    name: "Works On My Machine",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "deploy.ts",
        code: 'export function deploy(env: string) {\n  if (env !== "my-laptop") {\n    throw new Blame("devops");\n  }\n  return "works on my machine";\n}\n\ndeploy("production");',
      },
      Python: {
        fileName: "deploy.py",
        code: 'def deploy(env: str) -> str:\n    if env != "my-laptop":\n        raise Blame("devops")\n    return "works on my machine"\n\n\ndeploy("production")',
      },
      Rust: {
        fileName: "deploy.rs",
        code: 'fn deploy(env: &str) -> Result<&str, Blame> {\n    if env != "my-laptop" {\n        return Err(Blame::new("devops"));\n    }\n    Ok("works on my machine")\n}\n\ndeploy("production")?;',
      },
      Go: {
        fileName: "deploy.go",
        code: 'func Deploy(env string) (string, error) {\n    if env != "my-laptop" {\n        return "", Blame("devops")\n    }\n    return "works on my machine", nil\n}\n\nDeploy("production")',
      },
      Java: {
        fileName: "Deploy.java",
        code: 'String deploy(String env) {\n    if (!env.equals("my-laptop")) {\n        throw new Blame("devops");\n    }\n    return "works on my machine";\n}\n\nvoid main() { deploy("production"); }',
      },
      Swift: {
        fileName: "Deploy.swift",
        code: 'func deploy(_ env: String) throws -> String {\n    guard env == "my-laptop" else {\n        throw Blame("devops")\n    }\n    return "works on my machine"\n}\n\ntry deploy("production")',
      },
    },
  },
  {
    id: "friday-deploy",
    name: "Friday Deploy",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "friday.ts",
        code: 'const now = "Friday 5:59pm";\n\nawait git.add(".");\nawait git.commit("small fix");\nawait git.push({ force: true });\n\ndelete me.weekend;\nconsole.log("see you monday");',
      },
      Python: {
        fileName: "friday.py",
        code: 'now = "Friday 5:59pm"\n\ngit.add(".")\ngit.commit("small fix")\ngit.push(force=True)\n\ndel me.weekend\nprint("see you monday")',
      },
      Rust: {
        fileName: "friday.rs",
        code: 'let now = "Friday 5:59pm";\n\ngit.add(".")?;\ngit.commit("small fix")?;\ngit.push(Force::Yes)?;\n\nme.weekend.take();\nprintln!("see you monday");',
      },
      Go: {
        fileName: "friday.go",
        code: 'now := "Friday 5:59pm"\n\ngit.Add(".")\ngit.Commit("small fix")\ngit.Push(git.Force)\n\nme.Weekend = nil\nfmt.Println("see you monday")',
      },
      Java: {
        fileName: "Friday.java",
        code: 'void main() {\n    var now = "Friday 5:59pm";\n    git.add(".");\n    git.commit("small fix");\n    git.push(Force.YES);\n    me.weekend = null;\n    IO.println("see you monday");\n}',
      },
      Swift: {
        fileName: "Friday.swift",
        code: 'let now = "Friday 5:59pm"\n\ntry await git.add(".")\ntry await git.commit("small fix")\ntry await git.push(force: true)\n\nme.weekend = nil\nprint("see you monday")',
      },
    },
  },
  {
    id: "sharma-ji",
    name: "The Neighbor's Kid",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "reportCard.ts",
        code: 'function review(marks: number): string {\n  if (marks < 100) {\n    parents.compare(sharmaJi.son);\n  }\n  mom.hug(me);\n  return "proud of you anyway";\n}\n\nreview(98);',
      },
      Python: {
        fileName: "report_card.py",
        code: 'def review(marks: int) -> str:\n    if marks < 100:\n        parents.compare(sharma_ji.son)\n    mom.hug(me)\n    return "proud of you anyway"\n\n\nreview(98)',
      },
      Rust: {
        fileName: "report_card.rs",
        code: 'fn review(marks: u8) -> &\'static str {\n    if marks < 100 {\n        parents.compare(&sharma_ji.son);\n    }\n    mom.hug(&me);\n    "proud of you anyway"\n}\n\nreview(98);',
      },
      Go: {
        fileName: "report_card.go",
        code: 'func Review(marks int) string {\n    if marks < 100 {\n        parents.Compare(sharmaJi.Son)\n    }\n    mom.Hug(me)\n    return "proud of you anyway"\n}\n\nReview(98)',
      },
      Java: {
        fileName: "ReportCard.java",
        code: 'String review(int marks) {\n    if (marks < 100) {\n        parents.compare(sharmaJi.son);\n    }\n    mom.hug(me);\n    return "proud of you anyway";\n}\n\nvoid main() { review(98); }',
      },
      Swift: {
        fileName: "ReportCard.swift",
        code: 'func review(_ marks: Int) -> String {\n    if marks < 100 {\n        parents.compare(sharmaJi.son)\n    }\n    mom.hug(me)\n    return "proud of you anyway"\n}\n\nreview(98)',
      },
    },
  },
  {
    id: "exam-3am",
    name: "3AM Exam",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "examNight.ts",
        code: 'const sleep = null;\nconst chapters = syllabus.remaining();\n\nwhile (clock.now() < "9:00") {\n  syllabus.cram({ at: "3am" });\n  coffee++;\n}\n\nconsole.log("studied the important ones");',
      },
      Python: {
        fileName: "exam_night.py",
        code: 'sleep = None\nchapters = syllabus.remaining()\n\nwhile clock.now() < "9:00":\n    syllabus.cram(at="3am")\n    coffee += 1\n\nprint("studied the important ones")',
      },
      Rust: {
        fileName: "exam_night.rs",
        code: 'let sleep: Option<Hours> = None;\nlet chapters = syllabus.remaining();\n\nwhile clock.now() < "9:00" {\n    syllabus.cram("3am");\n    coffee += 1;\n}\n\nprintln!("studied the important ones");',
      },
      Go: {
        fileName: "exam_night.go",
        code: 'var sleep *Hours\nchapters := syllabus.Remaining()\n\nfor clock.Now() < "9:00" {\n    syllabus.Cram("3am")\n    coffee++\n}\n\nfmt.Println("studied the important ones")',
      },
      Java: {
        fileName: "ExamNight.java",
        code: 'void main() {\n    Hours sleep = null;\n    var chapters = syllabus.remaining();\n    while (clock.now().isBefore(NINE_AM)) {\n        syllabus.cram("3am");\n        coffee++;\n    }\n    IO.println("studied the important ones");\n}',
      },
      Swift: {
        fileName: "ExamNight.swift",
        code: 'let sleep: Hours? = nil\nlet chapters = syllabus.remaining()\n\nwhile clock.now() < "9:00" {\n    syllabus.cram(at: "3am")\n    coffee += 1\n}\n\nprint("studied the important ones")',
      },
    },
  },
  {
    id: "cat-keyboard",
    name: "Cat On Keyboard",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "cat.ts",
        code: 'cat.sitOn(keyboard);\n\nif (cat.purr()) {\n  human.pause(work);\n  human.pet(cat);\n}\n\nconst deadline = "can wait";',
      },
      Python: {
        fileName: "cat.py",
        code: 'cat.sit_on(keyboard)\n\nif cat.purr():\n    human.pause(work)\n    human.pet(cat)\n\ndeadline = "can wait"',
      },
      Rust: {
        fileName: "cat.rs",
        code: 'cat.sit_on(&keyboard);\n\nif cat.purr() {\n    human.pause(&work);\n    human.pet(&cat);\n}\n\nlet deadline = "can wait";',
      },
      Go: {
        fileName: "cat.go",
        code: 'cat.SitOn(keyboard)\n\nif cat.Purr() {\n    human.Pause(work)\n    human.Pet(cat)\n}\n\ndeadline := "can wait"',
      },
      Java: {
        fileName: "Cat.java",
        code: 'void main() {\n    cat.sitOn(keyboard);\n    if (cat.purr()) {\n        human.pause(work);\n        human.pet(cat);\n    }\n    var deadline = "can wait";\n}',
      },
      Swift: {
        fileName: "Cat.swift",
        code: 'cat.sit(on: keyboard)\n\nif cat.purr() {\n    human.pause(work)\n    human.pet(cat)\n}\n\nlet deadline = "can wait"',
      },
    },
  },
  {
    id: "salary-day",
    name: "Salary Day",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "salary.ts",
        code: 'let balance = 0;\n\nfunction onSalaryDay(salary: number) {\n  balance += salary;\n  rent.pay();\n  setTimeout(() => (balance = 0), 3 * DAY);\n}\n\nconst savings = balance - wishlist.length;',
      },
      Python: {
        fileName: "salary.py",
        code: 'balance = 0\n\ndef on_salary_day(salary: int) -> None:\n    global balance\n    balance += salary\n    rent.pay()\n    later(3 * DAY, wallet.empty)\n\nsavings = balance - len(wishlist)',
      },
      Rust: {
        fileName: "salary.rs",
        code: 'let mut balance = 0;\n\nlet mut on_salary_day = |salary: u32| {\n    balance += salary;\n    rent.pay();\n    later(3 * DAY, || wallet.empty());\n};\n\nlet savings = balance - wishlist.len();',
      },
      Go: {
        fileName: "salary.go",
        code: 'balance := 0\n\nonSalaryDay := func(salary int) {\n    balance += salary\n    rent.Pay()\n    time.AfterFunc(3*day, wallet.Empty)\n}\n\nsavings := balance - len(wishlist)',
      },
      Java: {
        fileName: "Salary.java",
        code: 'int balance = 0;\n\nvoid main() {\n    balance += salary;\n    rent.pay();\n    later(Duration.ofDays(3), wallet::empty);\n    var savings = balance - wishlist.size();\n}',
      },
      Swift: {
        fileName: "Salary.swift",
        code: 'var balance = 0\n\nfunc onSalaryDay(_ salary: Int) {\n    balance += salary\n    rent.pay()\n    later(.days(3)) { balance = 0 }\n}\n\nlet savings = balance - wishlist.count',
      },
    },
  },
  {
    id: "monday",
    name: "Monday",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "monday.ts",
        code: 'const today = calendar.today();\n\nconst motivation =\n  today === "Monday" ? undefined : coffee();\n\nif (!motivation) {\n  alarm.snooze(Infinity);\n}',
      },
      Python: {
        fileName: "monday.py",
        code: 'today = calendar.today()\n\nmotivation = (\n    None if today == "Monday" else coffee()\n)\n\nif not motivation:\n    alarm.snooze(math.inf)',
      },
      Rust: {
        fileName: "monday.rs",
        code: 'let today = calendar::today();\n\nlet motivation = (today != Weekday::Mon)\n    .then(coffee);\n\nif motivation.is_none() {\n    alarm.snooze(Duration::MAX);\n}',
      },
      Go: {
        fileName: "monday.go",
        code: 'today := time.Now().Weekday()\n\nvar motivation *Coffee\nif today != time.Monday {\n    motivation = Brew()\n}\nif motivation == nil {\n    alarm.Snooze(math.MaxInt)\n}',
      },
      Java: {
        fileName: "Monday.java",
        code: 'void main() {\n    var today = LocalDate.now().getDayOfWeek();\n    var motivation = today == MONDAY\n        ? null\n        : coffee();\n    if (motivation == null) {\n        alarm.snooze(Long.MAX_VALUE);\n    }\n}',
      },
      Swift: {
        fileName: "Monday.swift",
        code: 'let today = Calendar.current.today\n\nlet motivation = today == .monday\n    ? nil : coffee()\n\nif motivation == nil {\n    alarm.snooze(.infinity)\n}',
      },
    },
  },
  {
    id: "ex",
    name: "The Ex",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "ex.ts",
        code: 'try {\n  us.makeItWork();\n} catch (feelings) {\n  git.revert("us");\n} finally {\n  delete heart.ex;\n  playlist.remove("our song");\n}',
      },
      Python: {
        fileName: "ex.py",
        code: 'try:\n    us.make_it_work()\nexcept Feelings:\n    git.revert("us")\nfinally:\n    del heart.ex\n    playlist.remove("our song")',
      },
      Rust: {
        fileName: "ex.rs",
        code: 'match us.make_it_work() {\n    Ok(_) => {}\n    Err(_feelings) => {\n        git.revert("us");\n        heart.ex.take();\n        playlist.remove("our song");\n    }\n}',
      },
      Go: {
        fileName: "ex.go",
        code: 'defer playlist.Remove("our song")\ndefer func() {\n    heart.Ex = nil\n}()\n\nif err := us.MakeItWork(); err != nil {\n    git.Revert("us")\n}',
      },
      Java: {
        fileName: "Ex.java",
        code: 'void main() {\n    try {\n        us.makeItWork();\n    } catch (Feelings f) {\n        git.revert("us");\n    } finally {\n        playlist.remove("our song");\n    }\n}',
      },
      Swift: {
        fileName: "Ex.swift",
        code: 'defer { playlist.remove("our song") }\n\ndo {\n    try us.makeItWork()\n} catch {\n    git.revert("us")\n    heart.ex = nil\n}',
      },
    },
  },
  {
    id: "leg-day",
    name: "Leg Day",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "workout.ts",
        code: 'const sets = ["chest", "arms", "legs"];\n\nfor (const set of sets) {\n  if (set === "legs") {\n    continue;\n  }\n  lift(set);\n  mirror.selfie();\n}',
      },
      Python: {
        fileName: "workout.py",
        code: 'sets = ["chest", "arms", "legs"]\n\nfor muscle in sets:\n    if muscle == "legs":\n        continue\n    lift(muscle)\n    mirror.selfie()',
      },
      Rust: {
        fileName: "workout.rs",
        code: 'let sets = ["chest", "arms", "legs"];\n\nfor set in sets {\n    if set == "legs" {\n        continue;\n    }\n    lift(set);\n    mirror.selfie();\n}',
      },
      Go: {
        fileName: "workout.go",
        code: 'sets := []string{"chest", "arms", "legs"}\n\nfor _, set := range sets {\n    if set == "legs" {\n        continue\n    }\n    lift(set)\n    mirror.Selfie()\n}',
      },
      Java: {
        fileName: "Workout.java",
        code: 'void main() {\n    var sets = List.of("chest", "arms", "legs");\n    for (var set : sets) {\n        if (set.equals("legs")) continue;\n        lift(set);\n        mirror.selfie();\n    }\n}',
      },
      Swift: {
        fileName: "Workout.swift",
        code: 'let sets = ["chest", "arms", "legs"]\n\nfor set in sets {\n    if set == "legs" {\n        continue\n    }\n    lift(set)\n    mirror.selfie()\n}',
      },
    },
  },
  {
    id: "mom-calling",
    name: "Mom Calling",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "mom.ts",
        code: 'class Mom {\n  call(child: Child) {\n    for (let i = 0; i < 3; i++) {\n      child.ask("did you eat?");\n    }\n    child.pack(food.forAWeek());\n    return "love you, call me back";\n  }\n}',
      },
      Python: {
        fileName: "mom.py",
        code: 'class Mom:\n    def call(self, child: Child) -> str:\n        for _ in range(3):\n            child.ask("did you eat?")\n        child.pack(food.for_a_week())\n        return "love you, call me back"\n\n\nMom().call(me)',
      },
      Rust: {
        fileName: "mom.rs",
        code: 'impl Mom {\n    fn call(&self, child: &mut Child) -> &str {\n        for _ in 0..3 {\n            child.ask("did you eat?");\n        }\n        child.pack(Food::for_a_week());\n        "love you, call me back"\n    }\n}',
      },
      Go: {
        fileName: "mom.go",
        code: 'func (m Mom) Call(child *Child) string {\n    for range 3 {\n        child.Ask("did you eat?")\n    }\n    child.Pack(food.ForAWeek())\n    return "love you, call me back"\n}',
      },
      Java: {
        fileName: "Mom.java",
        code: 'void main() {\n    for (int i = 0; i < 3; i++) {\n        child.ask("did you eat?");\n    }\n    child.pack(food.forAWeek());\n    IO.println("love you, call me back");\n}',
      },
      Swift: {
        fileName: "Mom.swift",
        code: 'struct Mom {\n    func call(_ child: Child) -> String {\n        for _ in 0..<3 {\n            child.ask("did you eat?")\n        }\n        child.pack(food.forAWeek())\n        return "love you, call me back"\n    }\n}',
      },
    },
  },
  {
    id: "ai-took-my-job",
    name: "AI Took My Job",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "career.ts",
        code: 'async function career(dev: Developer) {\n  const me = await ai.replace(dev);\n  resume.addSkill("prompt engineering");\n  return me.ask("can you fix this bug?");\n}\n\nexport const author = "the AI";',
      },
      Python: {
        fileName: "career.py",
        code: 'async def career(dev):\n    me = await ai.replace(dev)\n    resume.add_skill("prompt engineering")\n    return me.ask("can you fix this bug?")\n\n\nauthor = "the AI"',
      },
      Rust: {
        fileName: "career.rs",
        code: 'async fn career(dev: Developer) -> Answer {\n    let me = ai.replace(dev).await;\n    resume.add_skill("prompt engineering");\n    me.ask("can you fix this bug?")\n}\n\npub const AUTHOR: &str = "the AI";',
      },
      Go: {
        fileName: "career.go",
        code: 'func Career(dev Developer) Answer {\n    me := ai.Replace(dev)\n    resume.AddSkill("prompt engineering")\n    return me.Ask("can you fix this bug?")\n}\n\nconst Author = "the AI"',
      },
      Java: {
        fileName: "Career.java",
        code: 'void main() {\n    var me = ai.replace(developer);\n    resume.addSkill("prompt engineering");\n    me.ask("can you fix this bug?");\n\n    var author = "the AI";\n}',
      },
      Swift: {
        fileName: "Career.swift",
        code: 'func career(_ dev: Developer) async -> Answer {\n    let me = await ai.replace(dev)\n    resume.addSkill("prompt engineering")\n    return me.ask("can you fix this bug?")\n}\n\nlet author = "the AI"',
      },
    },
  },
  {
    id: "snooze",
    name: "Snooze",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "alarm.ts",
        code: 'bed.time = "2:00";\nalarm.set("6:00");\n\nalarm.on("ring", () => {\n  alarm.snooze(Infinity);\n  boss.message("stuck in traffic");\n});',
      },
      Python: {
        fileName: "alarm.py",
        code: 'bed.time = "2:00"\nalarm.set("6:00")\n\n@alarm.on("ring")\ndef ring():\n    alarm.snooze(math.inf)\n    boss.message("stuck in traffic")',
      },
      Rust: {
        fileName: "alarm.rs",
        code: 'bed.time = "2:00";\nalarm.set("6:00");\n\nalarm.on_ring(|| {\n    alarm.snooze(Duration::MAX);\n    boss.message("stuck in traffic");\n});',
      },
      Go: {
        fileName: "alarm.go",
        code: 'bed.Time = "2:00"\nalarm.Set("6:00")\n\nalarm.OnRing(func() {\n    alarm.Snooze(math.MaxInt)\n    boss.Message("stuck in traffic")\n})',
      },
      Java: {
        fileName: "Alarm.java",
        code: 'void main() {\n    bed.time = "2:00";\n    alarm.set("6:00");\n    alarm.onRing(() -> {\n        alarm.snooze(Long.MAX_VALUE);\n        boss.message("stuck in traffic");\n    });\n}',
      },
      Swift: {
        fileName: "Alarm.swift",
        code: 'bed.time = "2:00"\nalarm.set("6:00")\n\nalarm.onRing {\n    alarm.snooze(.infinity)\n    boss.message("stuck in traffic")\n}',
      },
    },
  },
  {
    id: "diet-monday",
    name: "Diet Starts Monday",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "diet.ts",
        code: 'function onMonday() {\n  scale.hide();\n  diet.start(nextMonday());\n  pizza.order({ reason: "last one" });\n}\n\nsetInterval(onMonday, 7 * DAY);',
      },
      Python: {
        fileName: "diet.py",
        code: 'def on_monday():\n    scale.hide()\n    diet.start(next_monday())\n    pizza.order(reason="last one")\n\n\nschedule.every().monday.do(on_monday)',
      },
      Rust: {
        fileName: "diet.rs",
        code: 'fn on_monday() {\n    scale.hide();\n    diet.start(next_monday());\n    pizza.order("last one");\n}\n\nevery(Weekday::Mon, on_monday);',
      },
      Go: {
        fileName: "diet.go",
        code: 'func OnMonday() {\n    scale.Hide()\n    diet.Start(NextMonday())\n    pizza.Order("last one")\n}\n\nevery(time.Monday, OnMonday)',
      },
      Java: {
        fileName: "Diet.java",
        code: 'void onMonday() {\n    scale.hide();\n    diet.start(nextMonday());\n    pizza.order("last one");\n}\n\nvoid main() { every(MONDAY, this::onMonday); }',
      },
      Swift: {
        fileName: "Diet.swift",
        code: 'func onMonday() {\n    scale.hide()\n    diet.start(nextMonday())\n    pizza.order(reason: "last one")\n}\n\nevery(.monday, do: onMonday)',
      },
    },
  },
  {
    id: "code-review",
    name: "Code Review",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "review.ts",
        code: 'const pr = {\n  additions: 4096,\n  tests: "deleted",\n};\n\nscroll.toBottom();\ncomment(pr, "LGTM");\nmerge(pr);',
      },
      Python: {
        fileName: "review.py",
        code: 'pr = PullRequest(\n    additions=4096,\n    tests="deleted",\n)\n\nscroll.to_bottom()\ncomment(pr, "LGTM")\nmerge(pr)',
      },
      Rust: {
        fileName: "review.rs",
        code: 'let pr = PullRequest {\n    additions: 4096,\n    tests: "deleted",\n};\n\nscroll.to_bottom();\ncomment(&pr, "LGTM");\nmerge(pr);',
      },
      Go: {
        fileName: "review.go",
        code: 'pr := PullRequest{\n    Additions: 4096,\n    Tests:     "deleted",\n}\n\nscroll.ToBottom()\ncomment(pr, "LGTM")\nmerge(pr)',
      },
      Java: {
        fileName: "Review.java",
        code: 'void main() {\n    var pr = new PullRequest(4096, "deleted");\n\n    scroll.toBottom();\n    comment(pr, "LGTM");\n    merge(pr);\n}',
      },
      Swift: {
        fileName: "Review.swift",
        code: 'let pr = PullRequest(\n    additions: 4096,\n    tests: "deleted"\n)\n\nscroll.toBottom()\ncomment(pr, "LGTM")\nmerge(pr)',
      },
    },
  },
  {
    id: "crypto-bro",
    name: "Crypto Bro",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "strategy.ts",
        code: 'class Strategy {\n  trade() {\n    buy(high);\n    sell(low);\n    tweet("we are so early");\n    this.trade();\n  }\n}',
      },
      Python: {
        fileName: "strategy.py",
        code: 'class Strategy:\n    def trade(self):\n        buy(high)\n        sell(low)\n        tweet("we are so early")\n        self.trade()\n\n\nStrategy().trade()',
      },
      Rust: {
        fileName: "strategy.rs",
        code: 'impl Strategy {\n    fn trade(&self) {\n        buy(HIGH);\n        sell(LOW);\n        tweet("we are so early");\n        self.trade();\n    }\n}',
      },
      Go: {
        fileName: "strategy.go",
        code: 'func (s Strategy) Trade() {\n    buy(high)\n    sell(low)\n    tweet("we are so early")\n    s.Trade()\n}\n\nStrategy{}.Trade()',
      },
      Java: {
        fileName: "Strategy.java",
        code: 'void trade() {\n    buy(HIGH);\n    sell(LOW);\n    tweet("we are so early");\n    trade();\n}\n\nvoid main() { trade(); }',
      },
      Swift: {
        fileName: "Strategy.swift",
        code: 'struct Strategy {\n    func trade() {\n        buy(.high)\n        sell(.low)\n        tweet("we are so early")\n        trade()\n    }\n}',
      },
    },
  },
  {
    id: "shaadi-kab",
    name: "When's The Wedding?",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "weddingSeason.ts",
        code: 'for (const relative of family) {\n  relative.ask("when is the wedding?");\n  me.smile({ awkwardly: true });\n}\n\ngrandma.ask("are you happy?");\nme.nod();\ngrandma.serve("extra dessert");',
      },
      Python: {
        fileName: "wedding_season.py",
        code: 'for relative in family:\n    relative.ask("when is the wedding?")\n    me.smile(awkwardly=True)\n\ngrandma.ask("are you happy?")\nme.nod()\ngrandma.serve("extra dessert")',
      },
      Rust: {
        fileName: "wedding_season.rs",
        code: 'for relative in &family {\n    relative.ask("when is the wedding?");\n    me.smile(Smile::Awkward);\n}\n\ngrandma.ask("are you happy?");\nme.nod();\ngrandma.serve("extra dessert");',
      },
      Go: {
        fileName: "wedding_season.go",
        code: 'for _, relative := range family {\n    relative.Ask("when is the wedding?")\n    me.Smile(Awkwardly)\n}\n\ngrandma.Ask("are you happy?")\nme.Nod()\ngrandma.Serve("extra dessert")',
      },
      Java: {
        fileName: "WeddingSeason.java",
        code: 'void main() {\n    for (var relative : family) {\n        relative.ask("when is the wedding?");\n        me.smile(AWKWARDLY);\n    }\n    grandma.ask("are you happy?");\n    me.nod();\n    grandma.serve("extra dessert");\n}',
      },
      Swift: {
        fileName: "WeddingSeason.swift",
        code: 'for relative in family {\n    relative.ask("when is the wedding?")\n    me.smile(.awkwardly)\n}\n\ngrandma.ask("are you happy?")\nme.nod()\ngrandma.serve("extra dessert")',
      },
    },
  },
  {
    id: "rizz",
    name: "Rizz",
    mood: "Funny",
    variants: {
      TypeScript: {
        fileName: "rizz.ts",
        code: 'const pickupLine = me.isFunny\n  ? joke()\n  : "are you a semicolon? " +\n    "I can\'t function without you";\n\nsend(crush, pickupLine);\nawait seen({ reply: null });',
      },
      Python: {
        fileName: "rizz.py",
        code: 'pickup_line = (\n    joke() if me.is_funny\n    else "are you a semicolon? "\n    "I can\'t function without you"\n)\n\nsend(crush, pickup_line)\nawait seen(reply=None)',
      },
      Rust: {
        fileName: "rizz.rs",
        code: 'let pickup_line = if me.is_funny {\n    joke()\n} else {\n    "are you a semicolon? \\\n     I can\'t function without you".into()\n};\n\nsend(&crush, &pickup_line);\nseen(Reply::None).await;',
      },
      Go: {
        fileName: "rizz.go",
        code: 'pickupLine := "are you a semicolon? " +\n    "I can\'t function without you"\nif me.IsFunny {\n    pickupLine = joke()\n}\n\nsend(crush, pickupLine)\nseen(nil)',
      },
      Java: {
        fileName: "Rizz.java",
        code: 'void main() {\n    var pickupLine = me.isFunny()\n        ? joke()\n        : "are you a semicolon? "\n        + "I can\'t function without you";\n    send(crush, pickupLine);\n    seen(null);\n}',
      },
      Swift: {
        fileName: "Rizz.swift",
        code: 'let pickupLine = me.isFunny\n    ? joke()\n    : "are you a semicolon? "\n    + "I can\'t function without you"\n\nsend(crush, pickupLine)\nawait seen(reply: nil)',
      },
    },
  },
];
