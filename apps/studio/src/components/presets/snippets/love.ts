import { Snippet } from "./types";

export const loveSnippets: Snippet[] = [
  {
    id: "missing-you",
    name: "Missing You",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "missing-you.ts",
        code: `let distance = km(you, me);

while (distance > 0) {
  phone.check("your name");
  distance = km(you, me);
}

me.hug(you, { duration: Infinity });`,
      },
      Python: {
        fileName: "missing_you.py",
        code: `distance = km(you, me)

while distance > 0:
    phone.check("your name")
    distance = km(you, me)

me.hug(you, duration=float("inf"))`,
      },
      Rust: {
        fileName: "missing_you.rs",
        code: `let mut distance = km(&you, &me);

while distance > 0.0 {
    phone.check("your name");
    distance = km(&you, &me);
}

me.hug(&you, Duration::MAX);`,
      },
      Go: {
        fileName: "missing_you.go",
        code: `distance := km(you, me)

for distance > 0 {
    phone.Check("your name")
    distance = km(you, me)
}

me.Hug(you, math.Inf(1))`,
      },
      Java: {
        fileName: "MissingYou.java",
        code: `void main() {
    double distance = km(you, me);

    while (distance > 0) {
        phone.check("your name");
        distance = km(you, me);
    }
    me.hug(you, Double.POSITIVE_INFINITY);
}`,
      },
      Swift: {
        fileName: "MissingYou.swift",
        code: `var distance = km(you, me)

while distance > 0 {
    phone.check("your name")
    distance = km(you, me)
}

me.hug(you, for: .infinity)`,
      },
    },
  },
  {
    id: "first-love",
    name: "First Love",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "first-love.ts",
        code: `const heart = new Heart();

if (you.walkIn()) {
  heart.skipBeat();
  words.forget();
  face.turn("red");
}

memory.save("the first time");`,
      },
      Python: {
        fileName: "first_love.py",
        code: `heart = Heart()

if you.walk_in():
    heart.skip_beat()
    words.forget()
    face.turn("red")

memory.save("the first time")`,
      },
      Rust: {
        fileName: "first_love.rs",
        code: `let mut heart = Heart::new();

if you.walk_in() {
    heart.skip_beat();
    words.forget();
    face.turn("red");
}

memory.save("the first time");`,
      },
      Go: {
        fileName: "first_love.go",
        code: `heart := NewHeart()

if you.WalkIn() {
    heart.SkipBeat()
    words.Forget()
    face.Turn("red")
}

memory.Save("the first time")`,
      },
      Java: {
        fileName: "FirstLove.java",
        code: `void main() {
    Heart heart = new Heart();
    if (you.walkIn()) {
        heart.skipBeat();
        words.forget();
        face.turn("red");
    }
    memory.save("the first time");
}`,
      },
      Swift: {
        fileName: "FirstLove.swift",
        code: `let heart = Heart()

if you.walkIn() {
    heart.skipBeat()
    words.forget()
    face.turn("red")
}

memory.save("the first time")`,
      },
    },
  },
  {
    id: "butterflies",
    name: "Butterflies",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "butterflies.ts",
        code: `const crush = room.find("you");

while (crush.isNear()) {
  heart.race();
}

if (crush.says("hi")) {
  me.forget("how to talk");
}`,
      },
      Python: {
        fileName: "butterflies.py",
        code: `crush = room.find("you")

while crush.is_near():
    heart.race()

if crush.says("hi"):
    me.forget("how to talk")`,
      },
      Rust: {
        fileName: "butterflies.rs",
        code: `let crush = room.find("you");

while crush.is_near() {
    heart.race();
}

if crush.says("hi") {
    me.forget("how to talk");
}`,
      },
      Go: {
        fileName: "butterflies.go",
        code: `crush := room.Find("you")

for crush.IsNear() {
    heart.Race()
}

if crush.Says("hi") {
    me.Forget("how to talk")
}`,
      },
      Java: {
        fileName: "Butterflies.java",
        code: `void main() {
    var crush = room.find("you");
    while (crush.isNear()) {
        heart.race();
    }
    if (crush.says("hi")) {
        me.forget("how to talk");
    }
}`,
      },
      Swift: {
        fileName: "Butterflies.swift",
        code: `let crush = room.find("you")

while crush.isNear {
    heart.race()
}

if crush.says("hi") {
    me.forget("how to talk")
}`,
      },
    },
  },
  {
    id: "first-date",
    name: "First Date",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "first-date.ts",
        code: `const outfits = closet.tryOn("everything");
const date = await meet(you);

while (date.isGoing()) {
  clock.forget();
}

plans.add("second date");`,
      },
      Python: {
        fileName: "first_date.py",
        code: `outfits = closet.try_on("everything")
date = await meet(you)

while date.is_going():
    clock.forget()

plans.add("second date")`,
      },
      Rust: {
        fileName: "first_date.rs",
        code: `let outfits = closet.try_on("everything");
let date = meet(&you).await;

while date.is_going() {
    clock.forget();
}

plans.add("second date");`,
      },
      Go: {
        fileName: "first_date.go",
        code: `outfits := closet.TryOn("everything")
date := meet(you)

for date.IsGoing() {
    clock.Forget()
}

plans.Add("second date")`,
      },
      Java: {
        fileName: "FirstDate.java",
        code: `void main() {
    var outfits = closet.tryOn("everything");
    var date = meet(you);

    while (date.isGoing()) {
        clock.forget();
    }
    plans.add("second date");
}`,
      },
      Swift: {
        fileName: "FirstDate.swift",
        code: `let outfits = closet.tryOn("everything")
let date = await meet(you)

while date.isGoing {
    clock.forget()
}

plans.add("second date")`,
      },
    },
  },
  {
    id: "good-morning",
    name: "Good Morning",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "good-morning.ts",
        code: `const alarm = clock.ring("7:00");
const phone = alarm.snooze();

if (phone.has(you, "good morning")) {
  me.smile();
  me.reply("morning, you");
  day.begin();
}`,
      },
      Python: {
        fileName: "good_morning.py",
        code: `alarm = clock.ring("7:00")
phone = alarm.snooze()

if phone.has(you, "good morning"):
    me.smile()
    me.reply("morning, you")
    day.begin()`,
      },
      Rust: {
        fileName: "good_morning.rs",
        code: `let alarm = clock.ring("7:00");
let phone = alarm.snooze();

if phone.has(&you, "good morning") {
    me.smile();
    me.reply("morning, you");
    day.begin();
}`,
      },
      Go: {
        fileName: "good_morning.go",
        code: `alarm := clock.Ring("7:00")
phone := alarm.Snooze()

if phone.Has(you, "good morning") {
    me.Smile()
    me.Reply("morning, you")
    day.Begin()
}`,
      },
      Java: {
        fileName: "GoodMorning.java",
        code: `void main() {
    var alarm = clock.ring("7:00");
    var phone = alarm.snooze();
    if (phone.has(you, "good morning")) {
        me.smile();
        me.reply("morning, you");
        day.begin();
    }
}`,
      },
      Swift: {
        fileName: "GoodMorning.swift",
        code: `let alarm = clock.ring("7:00")
let phone = alarm.snooze()

if phone.has(you, "good morning") {
    me.smile()
    me.reply("morning, you")
    day.begin()
}`,
      },
    },
  },
  {
    id: "long-distance",
    name: "Long Distance",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "long-distance.ts",
        code: `let daysLeft = calendar.until(reunion);

while (daysLeft > 0) {
  call(you, { until: "someone sleeps" });
  daysLeft--;
}

me.book(flightTo(you));`,
      },
      Python: {
        fileName: "long_distance.py",
        code: `days_left = calendar.until(reunion)

while days_left > 0:
    call(you, until="someone sleeps")
    days_left -= 1

me.book(flight_to(you))`,
      },
      Rust: {
        fileName: "long_distance.rs",
        code: `let mut days_left = calendar.until(&reunion);

while days_left > 0 {
    call(&you, Until::SomeoneSleeps);
    days_left -= 1;
}

me.book(flight_to(&you));`,
      },
      Go: {
        fileName: "long_distance.go",
        code: `daysLeft := calendar.Until(reunion)

for daysLeft > 0 {
    call(you, UntilSomeoneSleeps)
    daysLeft--
}

me.Book(flightTo(you))`,
      },
      Java: {
        fileName: "LongDistance.java",
        code: `void main() {
    int daysLeft = calendar.until(reunion);
    while (daysLeft > 0) {
        call(you, Until.SOMEONE_SLEEPS);
        daysLeft--;
    }
    me.book(flightTo(you));
}`,
      },
      Swift: {
        fileName: "LongDistance.swift",
        code: `var daysLeft = calendar.until(reunion)

while daysLeft > 0 {
    call(you, until: .someoneSleeps)
    daysLeft -= 1
}

me.book(flight(to: you))`,
      },
    },
  },
  {
    id: "anniversary",
    name: "Anniversary",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "anniversary.ts",
        code: `const years = calendar.since(firstDate);

for (const year of years) {
  photos.add(year, you);
  love.deepen();
}

cake.light(years.length);`,
      },
      Python: {
        fileName: "anniversary.py",
        code: `years = calendar.since(first_date)

for year in years:
    photos.add(year, you)
    love.deepen()

cake.light(len(years))`,
      },
      Rust: {
        fileName: "anniversary.rs",
        code: `let years = calendar.since(first_date);

for year in &years {
    photos.add(year, &you);
    love.deepen();
}

cake.light(years.len());`,
      },
      Go: {
        fileName: "anniversary.go",
        code: `years := calendar.Since(firstDate)

for _, year := range years {
    photos.Add(year, you)
    love.Deepen()
}

cake.Light(len(years))`,
      },
      Java: {
        fileName: "Anniversary.java",
        code: `void main() {
    var years = calendar.since(firstDate);

    for (var year : years) {
        photos.add(year, you);
        love.deepen();
    }
    cake.light(years.size());
}`,
      },
      Swift: {
        fileName: "Anniversary.swift",
        code: `let years = calendar.since(firstDate)

for year in years {
    photos.add(year, you)
    love.deepen()
}

cake.light(years.count)`,
      },
    },
  },
  {
    id: "forehead-kiss",
    name: "Forehead Kiss",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "forehead-kiss.ts",
        code: `const day = you.today();

if (day.wasHard()) {
  me.hold(you);
  me.kiss(you.forehead);
  world.quiet();
}

you.sleep({ feeling: "safe" });`,
      },
      Python: {
        fileName: "forehead_kiss.py",
        code: `day = you.today()

if day.was_hard():
    me.hold(you)
    me.kiss(you.forehead)
    world.quiet()

you.sleep(feeling="safe")`,
      },
      Rust: {
        fileName: "forehead_kiss.rs",
        code: `let day = you.today();

if day.was_hard() {
    me.hold(&you);
    me.kiss(&you.forehead);
    world.quiet();
}

you.sleep(Feeling::Safe);`,
      },
      Go: {
        fileName: "forehead_kiss.go",
        code: `day := you.Today()

if day.WasHard() {
    me.Hold(you)
    me.Kiss(you.Forehead)
    world.Quiet()
}

you.Sleep(Safe)`,
      },
      Java: {
        fileName: "ForeheadKiss.java",
        code: `void main() {
    var day = you.today();
    if (day.wasHard()) {
        me.hold(you);
        me.kiss(you.forehead());
        world.quiet();
    }
    you.sleep(Feeling.SAFE);
}`,
      },
      Swift: {
        fileName: "ForeheadKiss.swift",
        code: `let day = you.today()

if day.wasHard {
    me.hold(you)
    me.kiss(you.forehead)
    world.quiet()
}

you.sleep(feeling: .safe)`,
      },
    },
  },
  {
    id: "sharing-earphones",
    name: "Sharing Earphones",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "sharing-earphones.ts",
        code: `const [left, right] = earphones.split();
you.wear(left);
me.wear(right);

for (const song of playlist) {
  me.watch(you.react(song));
}
playlist.push("one more");`,
      },
      Python: {
        fileName: "sharing_earphones.py",
        code: `left, right = earphones.split()
you.wear(left)
me.wear(right)

for song in playlist:
    me.watch(you.react(song))

playlist.append("one more")`,
      },
      Rust: {
        fileName: "sharing_earphones.rs",
        code: `let (left, right) = earphones.split();
you.wear(left);
me.wear(right);

for song in &playlist {
    me.watch(you.react(song));
}
playlist.push("one more");`,
      },
      Go: {
        fileName: "sharing_earphones.go",
        code: `left, right := earphones.Split()
you.Wear(left)
me.Wear(right)

for _, song := range playlist {
    me.Watch(you.React(song))
}
playlist = append(playlist, "one more")`,
      },
      Java: {
        fileName: "SharingEarphones.java",
        code: `void main() {
    var pair = earphones.split();
    you.wear(pair.left());
    me.wear(pair.right());
    for (var song : playlist) {
        me.watch(you.react(song));
    }
    playlist.add("one more");
}`,
      },
      Swift: {
        fileName: "SharingEarphones.swift",
        code: `let (left, right) = earphones.split()
you.wear(left)
me.wear(right)

for song in playlist {
    me.watch(you.react(song))
}
playlist.append("one more")`,
      },
    },
  },
  {
    id: "slow-dance",
    name: "Slow Dance",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "slow-dance.ts",
        code: `const song = radio.play("something slow");
me.offer(hand);

while (song.isPlaying()) {
  sway(you, me);
  room.fadeOut();
}

you.leanOn(me);`,
      },
      Python: {
        fileName: "slow_dance.py",
        code: `song = radio.play("something slow")
me.offer(hand)

while song.is_playing():
    sway(you, me)
    room.fade_out()

you.lean_on(me)`,
      },
      Rust: {
        fileName: "slow_dance.rs",
        code: `let song = radio.play("something slow");
me.offer(hand);

while song.is_playing() {
    sway(&you, &me);
    room.fade_out();
}

you.lean_on(&me);`,
      },
      Go: {
        fileName: "slow_dance.go",
        code: `song := radio.Play("something slow")
me.Offer(hand)

for song.IsPlaying() {
    sway(you, me)
    room.FadeOut()
}

you.LeanOn(me)`,
      },
      Java: {
        fileName: "SlowDance.java",
        code: `void main() {
    var song = radio.play("something slow");
    me.offer(hand);
    while (song.isPlaying()) {
        sway(you, me);
        room.fadeOut();
    }
    you.leanOn(me);
}`,
      },
      Swift: {
        fileName: "SlowDance.swift",
        code: `let song = radio.play("something slow")
me.offer(hand)

while song.isPlaying {
    sway(you, me)
    room.fadeOut()
}

you.lean(on: me)`,
      },
    },
  },
  {
    id: "old-couple",
    name: "Old Couple",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "old-couple.ts",
        code: `you.memory.fade();

for (const morning of ourMornings) {
  tea.make(you, { sugar: 2 });
  me.say("it's me, still yours");
}

you.reachFor(me.hand);`,
      },
      Python: {
        fileName: "old_couple.py",
        code: `you.memory.fade()

for morning in our_mornings:
    tea.make(you, sugar=2)
    me.say("it's me, still yours")

you.reach_for(me.hand)`,
      },
      Rust: {
        fileName: "old_couple.rs",
        code: `you.memory.fade();

for _morning in &our_mornings {
    tea.make(&you, Sugar(2));
    me.say("it's me, still yours");
}

you.reach_for(&me.hand);`,
      },
      Go: {
        fileName: "old_couple.go",
        code: `you.Memory.Fade()

for range ourMornings {
    tea.Make(you, 2)
    me.Say("it's me, still yours")
}

you.ReachFor(me.Hand)`,
      },
      Java: {
        fileName: "OldCouple.java",
        code: `void main() {
    you.memory().fade();

    for (var morning : ourMornings) {
        tea.make(you, 2);
        me.say("it's me, still yours");
    }
    you.reachFor(me.hand());
}`,
      },
      Swift: {
        fileName: "OldCouple.swift",
        code: `you.memory.fade()

for _ in ourMornings {
    tea.make(you, sugar: 2)
    me.say("it's me, still yours")
}

you.reach(for: me.hand)`,
      },
    },
  },
  {
    id: "cooking-together",
    name: "Cooking Together",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "cooking-together.ts",
        code: `const recipe = book.open("pasta");

while (!recipe.done()) {
  you.stir();
  me.taste();
  me.distract(you);
}

recipe.burn().eat({ laughing: true });`,
      },
      Python: {
        fileName: "cooking_together.py",
        code: `recipe = book.open("pasta")

while not recipe.done():
    you.stir()
    me.taste()
    me.distract(you)

recipe.burn().eat(laughing=True)`,
      },
      Rust: {
        fileName: "cooking_together.rs",
        code: `let recipe = book.open("pasta");

while !recipe.done() {
    you.stir();
    me.taste();
    me.distract(&you);
}

recipe.burn().eat(Mood::Laughing);`,
      },
      Go: {
        fileName: "cooking_together.go",
        code: `recipe := book.Open("pasta")

for !recipe.Done() {
    you.Stir()
    me.Taste()
    me.Distract(you)
}

recipe.Burn().Eat(Laughing)`,
      },
      Java: {
        fileName: "CookingTogether.java",
        code: `void main() {
    var recipe = book.open("pasta");
    while (!recipe.done()) {
        you.stir();
        me.taste();
        me.distract(you);
    }
    recipe.burn().eat(Mood.LAUGHING);
}`,
      },
      Swift: {
        fileName: "CookingTogether.swift",
        code: `let recipe = book.open("pasta")

while !recipe.done {
    you.stir()
    me.taste()
    me.distract(you)
}

recipe.burn().eat(laughing: true)`,
      },
    },
  },
  {
    id: "holding-hands",
    name: "Holding Hands",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "holding-hands.ts",
        code: `const road = city.longestStreet();

for (const step of road) {
  me.hold(you.hand);
  worries.drop();
}

road.wishLonger();`,
      },
      Python: {
        fileName: "holding_hands.py",
        code: `road = city.longest_street()

for step in road:
    me.hold(you.hand)
    worries.drop()

road.wish_longer()`,
      },
      Rust: {
        fileName: "holding_hands.rs",
        code: `let road = city.longest_street();

for _step in &road {
    me.hold(&you.hand);
    worries.drop();
}

road.wish_longer();`,
      },
      Go: {
        fileName: "holding_hands.go",
        code: `road := city.LongestStreet()

for range road.Steps() {
    me.Hold(you.Hand)
    worries.Drop()
}

road.WishLonger()`,
      },
      Java: {
        fileName: "HoldingHands.java",
        code: `void main() {
    var road = city.longestStreet();

    for (var step : road) {
        me.hold(you.hand());
        worries.drop();
    }
    road.wishLonger();
}`,
      },
      Swift: {
        fileName: "HoldingHands.swift",
        code: `let road = city.longestStreet()

for _ in road {
    me.hold(you.hand)
    worries.drop()
}

road.wishLonger()`,
      },
    },
  },
  {
    id: "love-letter",
    name: "Love Letter",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "love-letter.ts",
        code: `const letter = new Letter({ to: "you" });

while (!letter.saysEnough()) {
  letter.add(reasons.next());
}

letter.sign("always, me");
mailbox.send(letter);`,
      },
      Python: {
        fileName: "love_letter.py",
        code: `letter = Letter(to="you")

while not letter.says_enough():
    letter.add(next(reasons))

letter.sign("always, me")
mailbox.send(letter)`,
      },
      Rust: {
        fileName: "love_letter.rs",
        code: `let mut letter = Letter::to("you");

while !letter.says_enough() {
    letter.add(reasons.next());
}

letter.sign("always, me");
mailbox.send(letter);`,
      },
      Go: {
        fileName: "love_letter.go",
        code: `letter := NewLetter("you")

for !letter.SaysEnough() {
    letter.Add(reasons.Next())
}

letter.Sign("always, me")
mailbox.Send(letter)`,
      },
      Java: {
        fileName: "LoveLetter.java",
        code: `void main() {
    var letter = new Letter("you");
    while (!letter.saysEnough()) {
        letter.add(reasons.next());
    }
    letter.sign("always, me");
    mailbox.send(letter);
}`,
      },
      Swift: {
        fileName: "LoveLetter.swift",
        code: `var letter = Letter(to: "you")

while !letter.saysEnough {
    letter.add(reasons.next())
}

letter.sign("always, me")
mailbox.send(letter)`,
      },
    },
  },
  {
    id: "airport-arrivals",
    name: "Airport Arrivals",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "airport-arrivals.ts",
        code: `const flight = arrivals.find("your flight");
sign.hold("welcome home");

while (flight.isDelayed()) {
  coffee.reorder();
  minutes.feelLonger();
}

me.runTo(you);`,
      },
      Python: {
        fileName: "airport_arrivals.py",
        code: `flight = arrivals.find("your flight")
sign.hold("welcome home")

while flight.is_delayed():
    coffee.reorder()
    minutes.feel_longer()

me.run_to(you)`,
      },
      Rust: {
        fileName: "airport_arrivals.rs",
        code: `let flight = arrivals.find("your flight");
sign.hold("welcome home");

while flight.is_delayed() {
    coffee.reorder();
    minutes.feel_longer();
}

me.run_to(&you);`,
      },
      Go: {
        fileName: "airport_arrivals.go",
        code: `flight := arrivals.Find("your flight")
sign.Hold("welcome home")

for flight.IsDelayed() {
    coffee.Reorder()
    minutes.FeelLonger()
}

me.RunTo(you)`,
      },
      Java: {
        fileName: "AirportArrivals.java",
        code: `void main() {
    var flight = arrivals.find("your flight");
    sign.hold("welcome home");
    while (flight.isDelayed()) {
        coffee.reorder();
        minutes.feelLonger();
    }
    me.runTo(you);
}`,
      },
      Swift: {
        fileName: "AirportArrivals.swift",
        code: `let flight = arrivals.find("your flight")
sign.hold("welcome home")

while flight.isDelayed {
    coffee.reorder()
    minutes.feelLonger()
}

me.run(to: you)`,
      },
    },
  },
  {
    id: "saying-it-first",
    name: "Saying It First",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "saying-it-first.ts",
        code: `const words = "I love you";
let courage = me.courage();
while (courage < words.length) {
  courage += you.smile();
}

if (await say(words) === "me too") {
  me.breathe();
}`,
      },
      Python: {
        fileName: "saying_it_first.py",
        code: `words = "I love you"
courage = me.courage()

while courage < len(words):
    courage += you.smile()

if say(words) == "me too":
    me.breathe()`,
      },
      Rust: {
        fileName: "saying_it_first.rs",
        code: `let words = "I love you";
let mut courage = me.courage();
while courage < words.len() {
    courage += you.smile();
}

if say(words) == "me too" {
    me.breathe();
}`,
      },
      Go: {
        fileName: "saying_it_first.go",
        code: `words := "I love you"
courage := me.Courage()
for courage < len(words) {
    courage += you.Smile()
}

if say(words) == "me too" {
    me.Breathe()
}`,
      },
      Java: {
        fileName: "SayingItFirst.java",
        code: `void main() {
    String words = "I love you";
    int courage = me.courage();
    while (courage < words.length()) {
        courage += you.smile();
    }
    if (say(words).equals("me too"))
        me.breathe();
}`,
      },
      Swift: {
        fileName: "SayingItFirst.swift",
        code: `let words = "I love you"
var courage = me.courage()
while courage < words.count {
    courage += you.smile()
}

if await say(words) == "me too" {
    me.breathe()
}`,
      },
    },
  },
  {
    id: "rainy-day",
    name: "Rainy Day",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "rainy-day.ts",
        code: `const weather = sky.check();

if (weather === "rain") {
  plans.cancel();
  blanket.share(you, me);
  tea.make(2);
}

time.slow();`,
      },
      Python: {
        fileName: "rainy_day.py",
        code: `weather = sky.check()

if weather == "rain":
    plans.cancel()
    blanket.share(you, me)
    tea.make(2)

time.slow()`,
      },
      Rust: {
        fileName: "rainy_day.rs",
        code: `let weather = sky.check();

if weather == Weather::Rain {
    plans.cancel();
    blanket.share(&you, &me);
    tea.make(2);
}

time.slow();`,
      },
      Go: {
        fileName: "rainy_day.go",
        code: `weather := sky.Check()

if weather == Rain {
    plans.Cancel()
    blanket.Share(you, me)
    tea.Make(2)
}

time.Slow()`,
      },
      Java: {
        fileName: "RainyDay.java",
        code: `void main() {
    var weather = sky.check();
    if (weather == Weather.RAIN) {
        plans.cancel();
        blanket.share(you, me);
        tea.make(2);
    }
    time.slow();
}`,
      },
      Swift: {
        fileName: "RainyDay.swift",
        code: `let weather = sky.check()

if weather == .rain {
    plans.cancel()
    blanket.share(you, me)
    tea.make(2)
}

time.slow()`,
      },
    },
  },
  {
    id: "the-proposal",
    name: "The Proposal",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "the-proposal.ts",
        code: `const ring = pocket.find("ring");
speech.forget();
me.kneel();

const answer = await ask(you, "Marry me?");
if (answer === "yes") {
  forever.begin(you, me);
}`,
      },
      Python: {
        fileName: "the_proposal.py",
        code: `ring = pocket.find("ring")
speech.forget()
me.kneel()

answer = ask(you, "Marry me?")
if answer == "yes":
    forever.begin(you, me)`,
      },
      Rust: {
        fileName: "the_proposal.rs",
        code: `let ring = pocket.find("ring");
speech.forget();
me.kneel();

let answer = ask(&you, "Marry me?");
if answer == "yes" {
    forever.begin(&you, &me);
}`,
      },
      Go: {
        fileName: "the_proposal.go",
        code: `ring := pocket.Find("ring")
speech.Forget()
me.Kneel()

answer := ask(you, "Marry me?")
if answer == "yes" {
    forever.Begin(you, me)
}`,
      },
      Java: {
        fileName: "TheProposal.java",
        code: `void main() {
    var ring = pocket.find("ring");
    speech.forget();
    me.kneel();
    var answer = ask(you, "Marry me?");
    if (answer.equals("yes")) {
        forever.begin(you, me);
    }
}`,
      },
      Swift: {
        fileName: "TheProposal.swift",
        code: `let ring = pocket.find("ring")
speech.forget()
me.kneel()

let answer = await ask(you, "Marry me?")
if answer == "yes" {
    forever.begin(you, me)
}`,
      },
    },
  },
  {
    id: "forever",
    name: "Forever",
    mood: "Love",
    variants: {
      TypeScript: {
        fileName: "forever.ts",
        code: `const vows = ["stay", "choose you"];
me.promise(you, vows);

while (true) {
  for (const vow of vows) {
    me.keep(vow);
  }
  tomorrow.arrive();
}`,
      },
      Python: {
        fileName: "forever.py",
        code: `vows = ["stay", "choose you"]
me.promise(you, vows)

while True:
    for vow in vows:
        me.keep(vow)
    tomorrow.arrive()`,
      },
      Rust: {
        fileName: "forever.rs",
        code: `let vows = ["stay", "choose you"];
me.promise(&you, &vows);

loop {
    for vow in &vows {
        me.keep(vow);
    }
    tomorrow.arrive();
}`,
      },
      Go: {
        fileName: "forever.go",
        code: `vows := []string{"stay", "choose you"}
me.Promise(you, vows)

for {
    for _, vow := range vows {
        me.Keep(vow)
    }
    tomorrow.Arrive()
}`,
      },
      Java: {
        fileName: "Forever.java",
        code: `void main() {
    var vows = List.of("stay", "choose you");
    me.promise(you, vows);
    while (true) {
        vows.forEach(me::keep);
        tomorrow.arrive();
    }
}`,
      },
      Swift: {
        fileName: "Forever.swift",
        code: `let vows = ["stay", "choose you"]
me.promise(you, vows)

while true {
    for vow in vows {
        me.keep(vow)
    }
    tomorrow.arrive()
}`,
      },
    },
  },
];
