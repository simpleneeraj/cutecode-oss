import { Snippet } from "./types";

export const motivationSnippets: Snippet[] = [
  {
    id: "not-today",
    name: "Not Today",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "not-today.ts",
        code: `let attempts = 0;

while (!dream.isReal) {
  attempts++;
  console.log("not today, quitting.");
  build(dream);
}
console.log(\`\${attempts} tries. worth it.\`);`,
      },
      Python: {
        fileName: "not_today.py",
        code: `attempts = 0

while not dream.is_real:
    attempts += 1
    print("not today, quitting.")
    build(dream)

print(f"{attempts} tries. worth it.")`,
      },
      Rust: {
        fileName: "not_today.rs",
        code: `fn main() {
    let mut attempts = 0;
    while !dream.is_real() {
        attempts += 1;
        println!("not today, quitting.");
        build(&mut dream);
    }
    println!("{attempts} tries. worth it.");
}`,
      },
      Go: {
        fileName: "not_today.go",
        code: `func main() {
    attempts := 0
    for !dream.IsReal() {
        attempts++
        fmt.Println("not today, quitting.")
        build(dream)
    }
    fmt.Println(attempts, "tries. worth it.")
}`,
      },
      Java: {
        fileName: "NotToday.java",
        code: `void main() {
    int attempts = 0;
    while (!dream.isReal()) {
        attempts++;
        IO.println("not today, quitting.");
        dream.build();
    }
    IO.println(attempts + " tries. worth it.");
}`,
      },
      Swift: {
        fileName: "NotToday.swift",
        code: `var attempts = 0

repeat {
    attempts += 1
    print("not today, quitting.")
    build(dream)
} while !dream.isReal

print("\\(attempts) tries. worth it.")`,
      },
    },
  },
  {
    id: "self-love",
    name: "Self Love",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "self-love.ts",
        code: `const me = { flaws: 47, stillHere: true };

const isEnough = (p: typeof me) => p.stillHere;

if (isEnough(me)) {
  console.log("enough, even on bad days.");
}`,
      },
      Python: {
        fileName: "self_love.py",
        code: `me = {"flaws": 47, "still_here": True}


def is_enough(person):
    return person["still_here"]


if is_enough(me):
    print("enough, even on bad days.")`,
      },
      Rust: {
        fileName: "self_love.rs",
        code: `struct Me { flaws: u32, still_here: bool }
fn is_enough(me: &Me) -> bool { me.still_here }

fn main() {
    let me = Me { flaws: 47, still_here: true };
    if is_enough(&me) {
        println!("enough, even on bad days.");
    }
}`,
      },
      Go: {
        fileName: "self_love.go",
        code: `func isEnough(flaws int, stillHere bool) bool {
    return stillHere
}

func main() {
    if isEnough(47, true) {
        fmt.Println("enough, even on bad days.")
    }
}`,
      },
      Java: {
        fileName: "SelfLove.java",
        code: `record Me(int flaws, boolean stillHere) {}

void main() {
    var me = new Me(47, true);
    if (me.stillHere()) {
        IO.println("enough, even on bad days.");
    }
}`,
      },
      Swift: {
        fileName: "SelfLove.swift",
        code: `struct Me {
    let flaws: Int
    let stillHere: Bool
}

let me = Me(flaws: 47, stillHere: true)
if me.stillHere {
    print("enough, even on bad days.")
}`,
      },
    },
  },
  {
    id: "burnout",
    name: "Burnout",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "burnout.ts",
        code: `const tasks = Infinity;
let energy = 10;

while (tasks > 0 && energy > 0) {
  work();
  energy--;
}
console.log("the list will wait. rest.");`,
      },
      Python: {
        fileName: "burnout.py",
        code: `tasks = float("inf")
energy = 10

while tasks > 0 and energy > 0:
    work()
    energy -= 1

print("the list will wait. rest.")`,
      },
      Rust: {
        fileName: "burnout.rs",
        code: `fn main() {
    let tasks = u64::MAX;
    let mut energy = 10;
    while tasks > 0 && energy > 0 {
        work();
        energy -= 1;
    }
    println!("the list will wait. rest.");
}`,
      },
      Go: {
        fileName: "burnout.go",
        code: `func main() {
    tasks, energy := math.MaxInt, 10
    for tasks > 0 && energy > 0 {
        work()
        energy--
    }
    fmt.Println("the list will wait. rest.")
}`,
      },
      Java: {
        fileName: "Burnout.java",
        code: `void main() {
    long tasks = Long.MAX_VALUE;
    int energy = 10;
    while (tasks > 0 && energy > 0) {
        work();
        energy--;
    }
    IO.println("the list will wait. rest.");
}`,
      },
      Swift: {
        fileName: "Burnout.swift",
        code: `let tasks = Int.max
var energy = 10

while tasks > 0 && energy > 0 {
    work()
    energy -= 1
}
print("the list will wait. rest.")`,
      },
    },
  },
  {
    id: "gratitude",
    name: "Gratitude",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "gratitude.ts",
        code: `const today = ["tea", "sun", "friends"];

for (const thing of today) {
  console.log(\`thank you, \${thing}.\`);
}

console.log("small things. one good day.");`,
      },
      Python: {
        fileName: "gratitude.py",
        code: `today = ["tea", "sun", "friends"]

for thing in today:
    print(f"thank you, {thing}.")

print("small things.")
print("one good day.")`,
      },
      Rust: {
        fileName: "gratitude.rs",
        code: `fn main() {
    let today = ["tea", "sun", "friends"];

    for thing in today {
        println!("thank you, {thing}.");
    }

    println!("small things. one good day.");
}`,
      },
      Go: {
        fileName: "gratitude.go",
        code: `func main() {
    today := []string{"tea", "sun", "friends"}

    for _, thing := range today {
        fmt.Printf("thank you, %s.\\n", thing)
    }

    fmt.Println("small things. one good day.")
}`,
      },
      Java: {
        fileName: "Gratitude.java",
        code: `void main() {
    String[] today = {"tea", "sun", "friends"};

    for (String thing : today) {
        IO.println("thank you, " + thing + ".");
    }

    IO.println("small things. one good day.");
}`,
      },
      Swift: {
        fileName: "Gratitude.swift",
        code: `let today = ["tea", "sun", "friends"]

for thing in today {
    print("thank you, \\(thing).")
}

print("small things. one good day.")`,
      },
    },
  },
  {
    id: "3am-doubts",
    name: "3AM Doubts",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "three-am-doubts.ts",
        code: `const thought = "everyone is ahead of me";
const hour = new Date().getHours();

if (hour === 3) {
  postpone(thought, "after sleep");
  console.log("not a fact. just 3am.");
}`,
      },
      Python: {
        fileName: "three_am_doubts.py",
        code: `from datetime import datetime

thought = "everyone is ahead of me"
hour = datetime.now().hour

if hour == 3:
    postpone(thought, "after sleep")
    print("not a fact. just 3am.")`,
      },
      Rust: {
        fileName: "three_am_doubts.rs",
        code: `fn main() {
    let thought = "everyone is ahead of me";
    let hour = Local::now().hour();

    if hour == 3 {
        postpone(thought, "after sleep");
        println!("not a fact. just 3am.");
    }
}`,
      },
      Go: {
        fileName: "three_am_doubts.go",
        code: `func main() {
    thought := "everyone is ahead of me"
    hour := time.Now().Hour()

    if hour == 3 {
        postpone(thought, "after sleep")
        fmt.Println("not a fact. just 3am.")
    }
}`,
      },
      Java: {
        fileName: "ThreeAmDoubts.java",
        code: `void main() {
    var thought = "everyone is ahead of me";
    int hour = LocalTime.now().getHour();

    if (hour == 3) {
        postpone(thought, "after sleep");
        IO.println("not a fact. just 3am.");
    }
}`,
      },
      Swift: {
        fileName: "ThreeAmDoubts.swift",
        code: `let thought = "everyone is ahead of me"
let hour = Calendar.current
    .component(.hour, from: Date())

if hour == 3 {
    postpone(thought, "after sleep")
    print("not a fact. just 3am.")
}`,
      },
    },
  },
  {
    id: "first-commit",
    name: "First Commit",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "first-commit.ts",
        code: `const repo = init("my-big-idea");

repo.add("README.md");
repo.commit("first commit");

console.log("it's not perfect. it exists.");
console.log("that's the hardest part.");`,
      },
      Python: {
        fileName: "first_commit.py",
        code: `repo = init("my-big-idea")

repo.add("README.md")
repo.commit("first commit")

print("it's not perfect. it exists.")
print("that's the hardest part.")`,
      },
      Rust: {
        fileName: "first_commit.rs",
        code: `fn main() {
    let mut repo = init("my-big-idea");

    repo.add("README.md");
    repo.commit("first commit");

    println!("it's not perfect. it exists.");
    println!("that's the hardest part.");
}`,
      },
      Go: {
        fileName: "first_commit.go",
        code: `func main() {
    repo := Init("my-big-idea")

    repo.Add("README.md")
    repo.Commit("first commit")

    fmt.Println("it's not perfect. it exists.")
    fmt.Println("that's the hardest part.")
}`,
      },
      Java: {
        fileName: "FirstCommit.java",
        code: `void main() {
    var repo = Repo.init("my-big-idea");

    repo.add("README.md");
    repo.commit("first commit");

    IO.println("it's not perfect. it exists.");
    IO.println("that's the hardest part.");
}`,
      },
      Swift: {
        fileName: "FirstCommit.swift",
        code: `let repo = Repo(name: "my-big-idea")

repo.add("README.md")
repo.commit("first commit")

print("it's not perfect. it exists.")
print("that's the hardest part.")`,
      },
    },
  },
  {
    id: "impostor-syndrome",
    name: "Impostor Syndrome",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "impostor-syndrome.ts",
        code: `const proof = ["built", "fixed", "grew"];
const feeling = "i'm faking it";

console.log(\`feeling: \${feeling}\`);
for (const p of proof) {
  console.log(\`but i \${p}.\`);
}
console.log("verdict: you belong here.");`,
      },
      Python: {
        fileName: "impostor_syndrome.py",
        code: `proof = ["built", "fixed", "grew"]
feeling = "i'm faking it"

print(f"feeling: {feeling}")
for p in proof:
    print(f"but i {p}.")

print("verdict: you belong here.")`,
      },
      Rust: {
        fileName: "impostor_syndrome.rs",
        code: `fn main() {
    let proof = ["built", "fixed", "grew"];
    let feeling = "i'm faking it";
    println!("feeling: {feeling}");
    for p in proof {
        println!("but i {p}.");
    }
    println!("verdict: you belong here.");
}`,
      },
      Go: {
        fileName: "impostor_syndrome.go",
        code: `func main() {
    proof := []string{"built", "fixed", "grew"}
    fmt.Println("feeling: i'm faking it")
    for _, p := range proof {
        fmt.Printf("but i %s.\\n", p)
    }
    fmt.Println("verdict: you belong here.")
}`,
      },
      Java: {
        fileName: "ImpostorSyndrome.java",
        code: `void main() {
    String[] proof = {"built", "fixed", "grew"};
    var feeling = "i'm faking it";
    IO.println("feeling: " + feeling);
    for (var p : proof) {
        IO.println("but i " + p + ".");
    }
    IO.println("verdict: you belong here.");
}`,
      },
      Swift: {
        fileName: "ImpostorSyndrome.swift",
        code: `let proof = ["built", "fixed", "grew"]
let feeling = "i'm faking it"

print("feeling: \\(feeling)")
for p in proof {
    print("but i \\(p).")
}
print("verdict: you belong here.")`,
      },
    },
  },
  {
    id: "small-steps",
    name: "Small Steps",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "small-steps.ts",
        code: `const goal = 1000;
let done = 0;

while (done < goal) {
  done += 1;
}

console.log(\`\${done} tiny steps. big leap.\`);`,
      },
      Python: {
        fileName: "small_steps.py",
        code: `goal = 1000
done = 0

while done < goal:
    done += 1

print(f"{done} tiny steps. big leap.")`,
      },
      Rust: {
        fileName: "small_steps.rs",
        code: `fn main() {
    let goal = 1000;
    let mut done = 0;
    while done < goal {
        done += 1;
    }
    println!("{done} tiny steps. big leap.");
}`,
      },
      Go: {
        fileName: "small_steps.go",
        code: `func main() {
    goal, done := 1000, 0
    for done < goal {
        done++
    }
    fmt.Println(done, "tiny steps. big leap.")
}`,
      },
      Java: {
        fileName: "SmallSteps.java",
        code: `void main() {
    int goal = 1000;
    int done = 0;
    while (done < goal) {
        done++;
    }
    IO.println(done + " tiny steps. big leap.");
}`,
      },
      Swift: {
        fileName: "SmallSteps.swift",
        code: `let goal = 1000
var done = 0

while done < goal {
    done += 1
}

print("\\(done) tiny steps. big leap.")`,
      },
    },
  },
  {
    id: "rest-day",
    name: "Rest Day",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "rest-day.ts",
        code: `const codingToday = false;

if (!codingToday) {
  console.log("not lazy. recharging.");
  console.log("even servers rest.");
}

console.log("back tomorrow at 100%.");`,
      },
      Python: {
        fileName: "rest_day.py",
        code: `coding_today = False

if not coding_today:
    print("not lazy. recharging.")
    print("even servers rest.")

print("back tomorrow at 100%.")`,
      },
      Rust: {
        fileName: "rest_day.rs",
        code: `fn main() {
    let coding_today = false;

    if !coding_today {
        println!("not lazy. recharging.");
        println!("even servers rest.");
    }
    println!("back tomorrow at 100%.");
}`,
      },
      Go: {
        fileName: "rest_day.go",
        code: `func main() {
    codingToday := false

    if !codingToday {
        fmt.Println("not lazy. recharging.")
        fmt.Println("even servers rest.")
    }
    fmt.Println("back tomorrow at 100%.")
}`,
      },
      Java: {
        fileName: "RestDay.java",
        code: `void main() {
    boolean codingToday = false;

    if (!codingToday) {
        IO.println("not lazy. recharging.");
        IO.println("even servers rest.");
    }
    IO.println("back tomorrow at 100%.");
}`,
      },
      Swift: {
        fileName: "RestDay.swift",
        code: `let codingToday = false

if !codingToday {
    print("not lazy. recharging.")
    print("even servers rest.")
}

print("back tomorrow at 100%.")`,
      },
    },
  },
  {
    id: "compare-less",
    name: "Compare Less",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "compare-less.ts",
        code: `const yesterday = 41;
const today = 42;

mute(theirHighlightReel);
if (today > yesterday) {
  console.log("better than yesterday me.");
  console.log("that's the only race.");
}`,
      },
      Python: {
        fileName: "compare_less.py",
        code: `yesterday = 41
today = 42

mute(their_highlight_reel)
if today > yesterday:
    print("better than yesterday me.")
    print("that's the only race.")`,
      },
      Rust: {
        fileName: "compare_less.rs",
        code: `fn main() {
    let (yesterday, today) = (41, 42);
    mute(their_highlight_reel);

    if today > yesterday {
        println!("better than yesterday me.");
        println!("that's the only race.");
    }
}`,
      },
      Go: {
        fileName: "compare_less.go",
        code: `func main() {
    yesterday, today := 41, 42
    mute(theirHighlightReel)

    if today > yesterday {
        fmt.Println("better than yesterday me.")
        fmt.Println("that's the only race.")
    }
}`,
      },
      Java: {
        fileName: "CompareLess.java",
        code: `void main() {
    int yesterday = 41, today = 42;
    mute(theirHighlightReel);

    if (today > yesterday) {
        IO.println("better than yesterday me.");
        IO.println("that's the only race.");
    }
}`,
      },
      Swift: {
        fileName: "CompareLess.swift",
        code: `let yesterday = 41
let today = 42

mute(theirHighlightReel)
if today > yesterday {
    print("better than yesterday me.")
    print("that's the only race.")
}`,
      },
    },
  },
  {
    id: "ship-it",
    name: "Ship It",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "ship-it.ts",
        code: `const bugs = 3;

if (bugs < 10) {
  deploy(app);
  console.log("shipped. it's alive.");
  console.log("bugs? roadmap items.");
  console.log("perfect ships in v2.");
}`,
      },
      Python: {
        fileName: "ship_it.py",
        code: `bugs = 3

if bugs < 10:
    deploy(app)
    print("shipped. it's alive.")
    print("bugs? roadmap items.")
    print("perfect ships in v2.")`,
      },
      Rust: {
        fileName: "ship_it.rs",
        code: `fn main() {
    let bugs = 3;
    if bugs < 10 {
        deploy(&app);
        println!("shipped. it's alive.");
        println!("bugs? roadmap items.");
        println!("perfect ships in v2.");
    }
}`,
      },
      Go: {
        fileName: "ship_it.go",
        code: `func main() {
    bugs := 3
    if bugs < 10 {
        deploy(app)
        fmt.Println("shipped. it's alive.")
        fmt.Println("bugs? roadmap items.")
        fmt.Println("perfect ships in v2.")
    }
}`,
      },
      Java: {
        fileName: "ShipIt.java",
        code: `void main() {
    int bugs = 3;
    if (bugs < 10) {
        deploy(app);
        IO.println("shipped. it's alive.");
        IO.println("bugs? roadmap items.");
        IO.println("perfect ships in v2.");
    }
}`,
      },
      Swift: {
        fileName: "ShipIt.swift",
        code: `let bugs = 3

if bugs < 10 {
    deploy(app)
    print("shipped. it's alive.")
    print("bugs? roadmap items.")
    print("perfect ships in v2.")
}`,
      },
    },
  },
  {
    id: "learning-curve",
    name: "Learning Curve",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "learning-curve.ts",
        code: `const errorsGoogled = 4096;
const understood = 1;

console.log(\`googled: \${errorsGoogled}\`);
console.log(\`understood: \${understood}\`);
console.log("still counts as learning.");
console.log("seniors google too.");`,
      },
      Python: {
        fileName: "learning_curve.py",
        code: `errors_googled = 4096
understood = 1

print(f"googled: {errors_googled}")
print(f"understood: {understood}")
print("still counts as learning.")
print("seniors google too.")`,
      },
      Rust: {
        fileName: "learning_curve.rs",
        code: `fn main() {
    let errors_googled = 4096;
    let understood = 1;
    println!("googled: {errors_googled}");
    println!("understood: {understood}");
    println!("still counts as learning.");
    println!("seniors google too.");
}`,
      },
      Go: {
        fileName: "learning_curve.go",
        code: `func main() {
    errorsGoogled, understood := 4096, 1
    fmt.Println("googled:", errorsGoogled)
    fmt.Println("understood:", understood)
    fmt.Println("still counts as learning.")
    fmt.Println("seniors google too.")
}`,
      },
      Java: {
        fileName: "LearningCurve.java",
        code: `void main() {
    int errorsGoogled = 4096;
    int understood = 1;
    IO.println("googled: " + errorsGoogled);
    IO.println("understood: " + understood);
    IO.println("still counts as learning.");
    IO.println("seniors google too.");
}`,
      },
      Swift: {
        fileName: "LearningCurve.swift",
        code: `let errorsGoogled = 4096
let understood = 1

print("googled: \\(errorsGoogled)")
print("understood: \\(understood)")
print("still counts as learning.")
print("seniors google too.")`,
      },
    },
  },
  {
    id: "day-one",
    name: "Day One",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "day-one.ts",
        code: `const calendar = ["today", "tomorrow"];

if (!calendar.includes("someday")) {
  console.log("someday isn't a day.");
  console.log("so today is day one.");
}

start();`,
      },
      Python: {
        fileName: "day_one.py",
        code: `calendar = ["today", "tomorrow"]

if "someday" not in calendar:
    print("someday isn't a day.")
    print("so today is day one.")

start()`,
      },
      Rust: {
        fileName: "day_one.rs",
        code: `fn main() {
    let calendar = ["today", "tomorrow"];
    if !calendar.contains(&"someday") {
        println!("someday isn't a day.");
        println!("so today is day one.");
    }
    start();
}`,
      },
      Go: {
        fileName: "day_one.go",
        code: `func main() {
    calendar := []string{"today", "tomorrow"}
    if !slices.Contains(calendar, "someday") {
        fmt.Println("someday isn't a day.")
        fmt.Println("so today is day one.")
    }
    start()
}`,
      },
      Java: {
        fileName: "DayOne.java",
        code: `void main() {
    var calendar = List.of("today", "tomorrow");
    if (!calendar.contains("someday")) {
        IO.println("someday isn't a day.");
        IO.println("so today is day one.");
    }
    start();
}`,
      },
      Swift: {
        fileName: "DayOne.swift",
        code: `let calendar = ["today", "tomorrow"]

if !calendar.contains("someday") {
    print("someday isn't a day.")
    print("so today is day one.")
}

start()`,
      },
    },
  },
  {
    id: "comeback",
    name: "Comeback",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "comeback.ts",
        code: `const falls = 7;
let rises = 0;

while (rises <= falls) {
  rises++;
}

console.log(\`fell \${falls}. rose \${rises}.\`);`,
      },
      Python: {
        fileName: "comeback.py",
        code: `falls = 7
rises = 0

while rises <= falls:
    rises += 1

print(f"fell {falls}. rose {rises}.")`,
      },
      Rust: {
        fileName: "comeback.rs",
        code: `fn main() {
    let falls = 7;
    let mut rises = 0;
    while rises <= falls {
        rises += 1;
    }
    println!("fell {falls}. rose {rises}.");
}`,
      },
      Go: {
        fileName: "comeback.go",
        code: `func main() {
    falls, rises := 7, 0
    for rises <= falls {
        rises++
    }
    fmt.Println("fell:", falls)
    fmt.Println("rose:", rises)
}`,
      },
      Java: {
        fileName: "Comeback.java",
        code: `void main() {
    int falls = 7;
    int rises = 0;
    while (rises <= falls) {
        rises++;
    }
    IO.println("fell " + falls + ".");
    IO.println("rose " + rises + ".");
}`,
      },
      Swift: {
        fileName: "Comeback.swift",
        code: `let falls = 7
var rises = 0

while rises <= falls {
    rises += 1
}

print("fell \\(falls). rose \\(rises).")`,
      },
    },
  },
  {
    id: "discipline",
    name: "Discipline",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "discipline.ts",
        code: `const motivation = 0;

for (let day = 1; day <= 30; day++) {
  showUp(motivation);
}

console.log("motivation: 0. streak: 30.");
console.log("turns out it was optional.");`,
      },
      Python: {
        fileName: "discipline.py",
        code: `motivation = 0

for _ in range(30):
    show_up(motivation)

print("motivation: 0. streak: 30.")
print("turns out it was optional.")`,
      },
      Rust: {
        fileName: "discipline.rs",
        code: `fn main() {
    let motivation = 0;
    for _ in 0..30 {
        show_up(motivation);
    }
    println!("motivation: 0. streak: 30.");
    println!("turns out it was optional.");
}`,
      },
      Go: {
        fileName: "discipline.go",
        code: `func main() {
    motivation := 0
    for range 30 {
        showUp(motivation)
    }
    fmt.Println("motivation: 0. streak: 30.")
    fmt.Println("turns out it was optional.")
}`,
      },
      Java: {
        fileName: "Discipline.java",
        code: `void main() {
    int motivation = 0;
    for (int day = 1; day <= 30; day++) {
        showUp(motivation);
    }
    IO.println("motivation: 0. streak: 30.");
    IO.println("turns out it was optional.");
}`,
      },
      Swift: {
        fileName: "Discipline.swift",
        code: `let motivation = 0

for _ in 1...30 {
    showUp(motivation)
}

print("motivation: 0. streak: 30.")
print("turns out it was optional.")`,
      },
    },
  },
  {
    id: "asking-for-help",
    name: "Asking for Help",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "asking-for-help.ts",
        code: `const hoursStuck = 9;
const afraidToAsk = true;

if (afraidToAsk) {
  ask("hey, i'm stuck. can you help?");
}
console.log(\`alone: \${hoursStuck}h\`);
console.log("together: 5 min");`,
      },
      Python: {
        fileName: "asking_for_help.py",
        code: `hours_stuck = 9
afraid_to_ask = True

if afraid_to_ask:
    ask("hey, i'm stuck. can you help?")

print(f"alone: {hours_stuck}h")
print("together: 5 min")`,
      },
      Rust: {
        fileName: "asking_for_help.rs",
        code: `fn main() {
    let hours_stuck = 9;
    let afraid_to_ask = true;
    if afraid_to_ask {
        ask("hey, i'm stuck. can you help?");
    }
    println!("alone: {hours_stuck}h");
    println!("together: 5 min");
}`,
      },
      Go: {
        fileName: "asking_for_help.go",
        code: `func main() {
    hoursStuck, afraidToAsk := 9, true
    if afraidToAsk {
        ask("hey, i'm stuck. can you help?")
    }
    fmt.Printf("alone: %dh\\n", hoursStuck)
    fmt.Println("together: 5 min")
}`,
      },
      Java: {
        fileName: "AskingForHelp.java",
        code: `void main() {
    int hoursStuck = 9;
    boolean afraidToAsk = true;
    if (afraidToAsk) {
        ask("hey, i'm stuck. can you help?");
    }
    IO.println("alone: " + hoursStuck + "h");
    IO.println("together: 5 min");
}`,
      },
      Swift: {
        fileName: "AskingForHelp.swift",
        code: `let hoursStuck = 9
let afraidToAsk = true

if afraidToAsk {
    ask("hey, i'm stuck. can you help?")
}
print("alone: \\(hoursStuck)h")
print("together: 5 min")`,
      },
    },
  },
  {
    id: "okay-to-fail",
    name: "It's Okay to Fail",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "okay-to-fail.ts",
        code: `try {
  launch(myIdea);
} catch (failure) {
  learn(failure);
  console.log("failed. not a failure.");
} finally {
  console.log("still proud i tried.");
}`,
      },
      Python: {
        fileName: "okay_to_fail.py",
        code: `try:
    launch(my_idea)
except Exception as failure:
    learn(failure)
    print("failed. not a failure.")
finally:
    print("still proud i tried.")`,
      },
      Rust: {
        fileName: "okay_to_fail.rs",
        code: `fn main() {
    if let Err(failure) = launch(my_idea) {
        learn(failure);
        println!("failed. not a failure.");
    }
    println!("still proud i tried.");
}`,
      },
      Go: {
        fileName: "okay_to_fail.go",
        code: `func main() {
    if err := launch(myIdea); err != nil {
        learn(err)
        fmt.Println("failed. not a failure.")
    }
    fmt.Println("still proud i tried.")
}`,
      },
      Java: {
        fileName: "OkayToFail.java",
        code: `void main() {
    try {
        launch(myIdea);
    } catch (Exception failure) {
        learn(failure);
        IO.println("failed. not a failure.");
    }
    IO.println("still proud i tried.");
}`,
      },
      Swift: {
        fileName: "OkayToFail.swift",
        code: `do {
    try launch(myIdea)
} catch {
    learn(error)
    print("failed. not a failure.")
}

print("still proud i tried.")`,
      },
    },
  },
  {
    id: "future-self",
    name: "Future Self",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "future-self.ts",
        code: `const me = new Person();

me.practice();
me.sleepEarly();
me.drinkWater();

const futureMe = me.inFiveYears();
console.log(futureMe.say("thank you."));`,
      },
      Python: {
        fileName: "future_self.py",
        code: `me = Person()

me.practice()
me.sleep_early()
me.drink_water()

future_me = me.in_five_years()
print(future_me.say("thank you."))`,
      },
      Rust: {
        fileName: "future_self.rs",
        code: `fn main() {
    let mut me = Person::new();
    me.practice();
    me.sleep_early();
    me.drink_water();
    let future_me = me.in_five_years();
    println!("{}", future_me.say("thank you."));
}`,
      },
      Go: {
        fileName: "future_self.go",
        code: `func main() {
    me := NewPerson()
    me.Practice()
    me.SleepEarly()
    me.DrinkWater()
    futureMe := me.InFiveYears()
    fmt.Println(futureMe.Say("thank you."))
}`,
      },
      Java: {
        fileName: "FutureSelf.java",
        code: `void main() {
    var me = new Person();
    me.practice();
    me.sleepEarly();
    me.drinkWater();
    var futureMe = me.inFiveYears();
    IO.println(futureMe.say("thank you."));
}`,
      },
      Swift: {
        fileName: "FutureSelf.swift",
        code: `var me = Person()

me.practice()
me.sleepEarly()
me.drinkWater()

let futureMe = me.inFiveYears()
print(futureMe.say("thank you."))`,
      },
    },
  },
  {
    id: "keep-going",
    name: "Keep Going",
    mood: "Motivation",
    variants: {
      TypeScript: {
        fileName: "keep-going.ts",
        code: `const week = ["good", "bad", "okay"];

for (const day of week) {
  console.log(\`\${day} day. keep going.\`);
}

console.log("every kind of day counts.");
console.log("still here. still going.");`,
      },
      Python: {
        fileName: "keep_going.py",
        code: `week = ["good", "bad", "okay"]

for day in week:
    print(f"{day} day. keep going.")

print("every kind of day counts.")
print("still here. still going.")`,
      },
      Rust: {
        fileName: "keep_going.rs",
        code: `fn main() {
    let week = ["good", "bad", "okay"];
    for day in week {
        println!("{day} day. keep going.");
    }
    println!("every kind of day counts.");
    println!("still here. still going.");
}`,
      },
      Go: {
        fileName: "keep_going.go",
        code: `func main() {
    week := []string{"good", "bad", "okay"}
    for _, day := range week {
        fmt.Println(day, "day. keep going.")
    }
    fmt.Println("every kind of day counts.")
    fmt.Println("still here. still going.")
}`,
      },
      Java: {
        fileName: "KeepGoing.java",
        code: `void main() {
    String[] week = {"good", "bad", "okay"};
    for (String day : week) {
        IO.println(day + " day. keep going.");
    }
    IO.println("every kind of day counts.");
    IO.println("still here. still going.");
}`,
      },
      Swift: {
        fileName: "KeepGoing.swift",
        code: `let week = ["good", "bad", "okay"]

for day in week {
    print("\\(day) day. keep going.")
}

print("every kind of day counts.")
print("still here. still going.")`,
      },
    },
  },
];
