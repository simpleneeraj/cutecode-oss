import { Snippet } from "./types";

export const heartbreakSnippets: Snippet[] = [
  {
    id: "heartbreak-unsent-message",
    name: "Unsent Message",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "unsent.ts",
        code: `const msg = "I still think about you";
let drafts = 0;
while (drafts < 47) {
  chat.type(msg);
  chat.erase(msg);
  drafts++;
}
chat.close();`,
      },
      Python: {
        fileName: "unsent.py",
        code: `msg = "I still think about you"
drafts = 0
while drafts < 47:
    chat.type(msg)
    chat.erase(msg)
    drafts += 1

chat.close()`,
      },
      Rust: {
        fileName: "unsent.rs",
        code: `fn main() {
    let msg = "I still think about you";
    for _draft in 0..47 {
        chat.type_out(msg);
        chat.erase(msg);
    }
    chat.close();
}`,
      },
      Go: {
        fileName: "unsent.go",
        code: `func main() {
    msg := "I still think about you"
    for drafts := 0; drafts < 47; drafts++ {
        chat.Type(msg)
        chat.Erase(msg)
    }
    chat.Close()
}`,
      },
      Java: {
        fileName: "Unsent.java",
        code: `void main() {
    var msg = "I still think about you";
    for (int draft = 0; draft < 47; draft++) {
        chat.type(msg);
        chat.erase(msg);
    }
    chat.close();
}`,
      },
      Swift: {
        fileName: "Unsent.swift",
        code: `let msg = "I still think about you"
var drafts = 0
while drafts < 47 {
    chat.type(msg)
    chat.erase(msg)
    drafts += 1
}
chat.close()`,
      },
    },
  },
  {
    id: "heartbreak-moving-on",
    name: "Moving On",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "movingOn.ts",
        code: `let days = 0;
while (heart.stillHurts()) {
  heart.heal(0.01);
  days++;
}
photos.archive("us");
console.log("Day " + days + ", I'm okay");`,
      },
      Python: {
        fileName: "moving_on.py",
        code: `days = 0
while heart.still_hurts():
    heart.heal(0.01)
    days += 1

photos.archive("us")
print(f"Day {days}, I'm okay")`,
      },
      Rust: {
        fileName: "moving_on.rs",
        code: `fn main() {
    let mut days = 0;
    while heart.still_hurts() {
        heart.heal(0.01);
        days += 1;
    }
    photos.archive("us");
    println!("Day {days}, I'm okay");
}`,
      },
      Go: {
        fileName: "moving_on.go",
        code: `func main() {
    days := 0
    for heart.StillHurts() {
        heart.Heal(0.01)
        days++
    }
    photos.Archive("us")
    fmt.Printf("Day %d, I'm okay", days)
}`,
      },
      Java: {
        fileName: "MovingOn.java",
        code: `void main() {
    int days = 0;
    while (heart.stillHurts()) {
        heart.heal(0.01);
        days++;
    }
    photos.archive("us");
    IO.println("Day " + days + ", I'm okay");
}`,
      },
      Swift: {
        fileName: "MovingOn.swift",
        code: `var days = 0
while heart.stillHurts() {
    heart.heal(0.01)
    days += 1
}
photos.archive("us")
print("Day \\(days), I'm okay")`,
      },
    },
  },
  {
    id: "heartbreak-breakup",
    name: "Breakup",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "breakup.ts",
        code: `const love = true;
const together = false;
if (love && !together) {
  say("It's not you. It's us.");
}
giveBack(spareKey);
keep(goodMemories);`,
      },
      Python: {
        fileName: "breakup.py",
        code: `love = True
together = False

if love and not together:
    say("It's not you. It's us.")

give_back(spare_key)
keep(good_memories)`,
      },
      Rust: {
        fileName: "breakup.rs",
        code: `fn main() {
    let love = true;
    let together = false;
    if love && !together {
        say("It's not you. It's us.");
    }
    give_back(spare_key);
    keep(good_memories);
}`,
      },
      Go: {
        fileName: "breakup.go",
        code: `func main() {
    love, together := true, false
    if love && !together {
        say("It's not you. It's us.")
    }
    giveBack(spareKey)
    keep(goodMemories)
}`,
      },
      Java: {
        fileName: "Breakup.java",
        code: `void main() {
    var love = true;
    var together = false;
    if (love && !together) {
        say("It's not you. It's us.");
    }
    giveBack(spareKey);
    keep(goodMemories);
}`,
      },
      Swift: {
        fileName: "Breakup.swift",
        code: `let love = true
let together = false
if love && !together {
    say("It's not you. It's us.")
}
giveBack(spareKey)
keep(goodMemories)`,
      },
    },
  },
  {
    id: "heartbreak-nostalgia",
    name: "Nostalgia",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "nostalgia.ts",
        code: `const route = maps.history("our old street");
for (const stop of route.stops) {
  walkPast(stop);
  linger(stop.memories.length);
}
cafe.order("one coffee, not two");
keepWalking();`,
      },
      Python: {
        fileName: "nostalgia.py",
        code: `route = maps.history("our old street")
for stop in route.stops:
    walk_past(stop)
    linger(len(stop.memories))

cafe.order("one coffee, not two")
keep_walking()`,
      },
      Rust: {
        fileName: "nostalgia.rs",
        code: `fn main() {
    let route = maps.history("our old street");
    for stop in &route.stops {
        walk_past(stop);
        linger(stop.memories.len());
    }
    cafe.order("one coffee, not two");
    keep_walking();
}`,
      },
      Go: {
        fileName: "nostalgia.go",
        code: `func main() {
    route := maps.History("our old street")
    for _, stop := range route.Stops {
        walkPast(stop)
        linger(len(stop.Memories))
    }
    cafe.Order("one coffee, not two")
    keepWalking()
}`,
      },
      Java: {
        fileName: "Nostalgia.java",
        code: `void main() {
    var route = maps.history("our old street");
    for (var stop : route.stops()) {
        walkPast(stop);
        linger(stop.memories().size());
    }
    cafe.order("one coffee, not two");
    keepWalking();
}`,
      },
      Swift: {
        fileName: "Nostalgia.swift",
        code: `let route = maps.history("our old street")
for stop in route.stops {
    walkPast(stop)
    linger(stop.memories.count)
}
cafe.order("one coffee, not two")
keepWalking()`,
      },
    },
  },
  {
    id: "heartbreak-gone-too-soon",
    name: "Gone Too Soon",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "goneTooSoon.ts",
        code: `contacts.keep(you);
for (const star of sky.tonight()) {
  if (star.isBrightest) {
    whisper("I miss you");
  }
}
carryForward(you.kindness);`,
      },
      Python: {
        fileName: "gone_too_soon.py",
        code: `contacts.keep(you)

for star in sky.tonight():
    if star.is_brightest:
        whisper("I miss you")

carry_forward(you.kindness)`,
      },
      Rust: {
        fileName: "gone_too_soon.rs",
        code: `fn main() {
    contacts.keep(&you);
    for star in sky.tonight() {
        if star.is_brightest {
            whisper("I miss you");
        }
    }
    carry_forward(&you.kindness);
}`,
      },
      Go: {
        fileName: "gone_too_soon.go",
        code: `func main() {
    contacts.Keep(you)
    for _, star := range sky.Tonight() {
        if star.IsBrightest {
            whisper("I miss you")
        }
    }
    carryForward(you.Kindness)
}`,
      },
      Java: {
        fileName: "GoneTooSoon.java",
        code: `void main() {
    contacts.keep(you);
    for (var star : sky.tonight()) {
        if (star.isBrightest()) {
            whisper("I miss you");
        }
    }
    carryForward(you.kindness());
}`,
      },
      Swift: {
        fileName: "GoneTooSoon.swift",
        code: `contacts.keep(you)
for star in sky.tonight() {
    if star.isBrightest {
        whisper("I miss you")
    }
}
carryForward(you.kindness)`,
      },
    },
  },
  {
    id: "heartbreak-last-voicemail",
    name: "Last Voicemail",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "lastVoicemail.ts",
        code: `const last = voicemail.find("talk tomorrow");
let plays = 0;
while (night.isLong()) {
  play(last);
  plays++;
}
voicemail.neverDelete(last);`,
      },
      Python: {
        fileName: "last_voicemail.py",
        code: `last = voicemail.find("talk tomorrow")
plays = 0
while night.is_long():
    play(last)
    plays += 1

voicemail.never_delete(last)`,
      },
      Rust: {
        fileName: "last_voicemail.rs",
        code: `fn main() {
    let last = voicemail.find("talk tomorrow");
    let mut plays = 0;
    while night.is_long() {
        play(&last);
        plays += 1;
    }
    voicemail.never_delete(last);
}`,
      },
      Go: {
        fileName: "last_voicemail.go",
        code: `func main() {
    last := voicemail.Find("talk tomorrow")
    plays := 0
    for night.IsLong() {
        play(last)
        plays++
    }
    voicemail.NeverDelete(last)
}`,
      },
      Java: {
        fileName: "LastVoicemail.java",
        code: `void main() {
    var last = voicemail.find("talk tomorrow");
    int plays = 0;
    while (night.isLong()) {
        play(last);
        plays++;
    }
    voicemail.neverDelete(last);
}`,
      },
      Swift: {
        fileName: "LastVoicemail.swift",
        code: `let last = voicemail.find("talk tomorrow")
var plays = 0
while night.isLong() {
    play(last)
    plays += 1
}
voicemail.neverDelete(last)`,
      },
    },
  },
  {
    id: "heartbreak-deleting-photos",
    name: "Deleting Photos",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "deletingPhotos.ts",
        code: `const album = photos.search("us");
for (const photo of album) {
  photo.lookAt();
  trash.add(photo);
}
trash.restoreAll();
photos.hide(album);`,
      },
      Python: {
        fileName: "deleting_photos.py",
        code: `album = photos.search("us")
for photo in album:
    photo.look_at()
    trash.add(photo)

trash.restore_all()
photos.hide(album)`,
      },
      Rust: {
        fileName: "deleting_photos.rs",
        code: `fn main() {
    let album = photos.search("us");
    for photo in &album {
        photo.look_at();
        trash.add(photo);
    }
    trash.restore_all();
    photos.hide(&album);
}`,
      },
      Go: {
        fileName: "deleting_photos.go",
        code: `func main() {
    album := photos.Search("us")
    for _, photo := range album {
        photo.LookAt()
        trash.Add(photo)
    }
    trash.RestoreAll()
    photos.Hide(album)
}`,
      },
      Java: {
        fileName: "DeletingPhotos.java",
        code: `void main() {
    var album = photos.search("us");
    for (var photo : album) {
        photo.lookAt();
        trash.add(photo);
    }
    trash.restoreAll();
    photos.hide(album);
}`,
      },
      Swift: {
        fileName: "DeletingPhotos.swift",
        code: `let album = photos.search("us")
for photo in album {
    photo.lookAt()
    trash.add(photo)
}
trash.restoreAll()
photos.hide(album)`,
      },
    },
  },
  {
    id: "heartbreak-old-playlist",
    name: "Old Playlist",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "oldPlaylist.ts",
        code: `const playlist = music.find("our summer");
for (const song of playlist.tracks) {
  if (song.reminds("you")) {
    skip(song);
  }
}
player.repeat(playlist);`,
      },
      Python: {
        fileName: "old_playlist.py",
        code: `playlist = music.find("our summer")

for song in playlist.tracks:
    if song.reminds("you"):
        skip(song)

player.repeat(playlist)`,
      },
      Rust: {
        fileName: "old_playlist.rs",
        code: `fn main() {
    let playlist = music.find("our summer");
    for song in &playlist.tracks {
        if song.reminds("you") {
            skip(song);
        }
    }
    player.repeat(&playlist);
}`,
      },
      Go: {
        fileName: "old_playlist.go",
        code: `func main() {
    playlist := music.Find("our summer")
    for _, song := range playlist.Tracks {
        if song.Reminds("you") {
            skip(song)
        }
    }
    player.Repeat(playlist)
}`,
      },
      Java: {
        fileName: "OldPlaylist.java",
        code: `void main() {
    var playlist = music.find("our summer");
    for (var song : playlist.tracks()) {
        if (song.reminds("you")) {
            skip(song);
        }
    }
    player.repeat(playlist);
}`,
      },
      Swift: {
        fileName: "OldPlaylist.swift",
        code: `let playlist = music.find("our summer")
for song in playlist.tracks {
    if song.reminds("you") {
        skip(song)
    }
}
player.repeat(playlist)`,
      },
    },
  },
  {
    id: "heartbreak-their-hoodie",
    name: "Their Hoodie",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "theirHoodie.ts",
        code: `const hoodie = closet.find("your hoodie");
let nights = 0;
while (hoodie.smellsLike("you")) {
  wear(hoodie);
  nights++;
}
closet.keep(hoodie);`,
      },
      Python: {
        fileName: "their_hoodie.py",
        code: `hoodie = closet.find("your hoodie")
nights = 0
while hoodie.smells_like("you"):
    wear(hoodie)
    nights += 1

closet.keep(hoodie)`,
      },
      Rust: {
        fileName: "their_hoodie.rs",
        code: `fn main() {
    let hoodie = closet.find("your hoodie");
    let mut nights = 0;
    while hoodie.smells_like("you") {
        wear(&hoodie);
        nights += 1;
    }
    closet.keep(hoodie);
}`,
      },
      Go: {
        fileName: "their_hoodie.go",
        code: `func main() {
    hoodie := closet.Find("your hoodie")
    nights := 0
    for hoodie.SmellsLike("you") {
        wear(hoodie)
        nights++
    }
    closet.Keep(hoodie)
}`,
      },
      Java: {
        fileName: "TheirHoodie.java",
        code: `void main() {
    var hoodie = closet.find("your hoodie");
    int nights = 0;
    while (hoodie.smellsLike("you")) {
        wear(hoodie);
        nights++;
    }
    closet.keep(hoodie);
}`,
      },
      Swift: {
        fileName: "TheirHoodie.swift",
        code: `let hoodie = closet.find("your hoodie")
var nights = 0
while hoodie.smellsLike("you") {
    wear(hoodie)
    nights += 1
}
closet.keep(hoodie)`,
      },
    },
  },
  {
    id: "heartbreak-mutual-friends",
    name: "Mutual Friends",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "mutualFriends.ts",
        code: `const invite = party.inviteFrom("Sam");
const guests = invite.guestList();
if (guests.includes("you")) {
  invite.reply("sorry, busy that night");
}
stayHome();
stories.watch(invite.photos);`,
      },
      Python: {
        fileName: "mutual_friends.py",
        code: `invite = party.invite_from("Sam")
guests = invite.guest_list()
if "you" in guests:
    invite.reply("sorry, busy that night")

stay_home()
stories.watch(invite.photos)`,
      },
      Rust: {
        fileName: "mutual_friends.rs",
        code: `fn main() {
    let invite = party.invite_from("Sam");
    let guests = invite.guest_list();
    if guests.contains(&"you") {
        invite.reply("sorry, busy that night");
    }
    stay_home();
    stories.watch(&invite.photos);
}`,
      },
      Go: {
        fileName: "mutual_friends.go",
        code: `func main() {
    invite := party.InviteFrom("Sam")
    guests := invite.GuestList()
    if slices.Contains(guests, "you") {
        invite.Reply("sorry, busy that night")
    }
    stayHome()
    stories.Watch(invite.Photos)
}`,
      },
      Java: {
        fileName: "MutualFriends.java",
        code: `void main() {
    var invite = party.inviteFrom("Sam");
    var guests = invite.guestList();
    if (guests.contains("you")) {
        invite.reply("sorry, busy that night");
    }
    stayHome();
    stories.watch(invite.photos());
}`,
      },
      Swift: {
        fileName: "MutualFriends.swift",
        code: `let invite = party.inviteFrom("Sam")
let guests = invite.guestList()
if guests.contains("you") {
    invite.reply("sorry, busy that night")
}
stayHome()
stories.watch(invite.photos)`,
      },
    },
  },
  {
    id: "heartbreak-first-birthday-apart",
    name: "First Birthday Apart",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "birthdayApart.ts",
        code: `const day = calendar.get("your birthday");
reminders.fire(day);
for (let hour = 0; hour < 24; hour++) {
  phone.hover("Happy birthday");
}
cake.cut("one slice");
wish("that you're happy");`,
      },
      Python: {
        fileName: "birthday_apart.py",
        code: `day = calendar.get("your birthday")
reminders.fire(day)
for hour in range(24):
    phone.hover("Happy birthday")

cake.cut("one slice")
wish("that you're happy")`,
      },
      Rust: {
        fileName: "birthday_apart.rs",
        code: `fn main() {
    let day = calendar.get("your birthday");
    reminders.fire(&day);
    for _hour in 0..24 {
        phone.hover("Happy birthday");
    }
    cake.cut("one slice");
    wish("that you're happy");
}`,
      },
      Go: {
        fileName: "birthday_apart.go",
        code: `func main() {
    day := calendar.Get("your birthday")
    reminders.Fire(day)
    for range 24 {
        phone.Hover("Happy birthday")
    }
    cake.Cut("one slice")
    wish("that you're happy")
}`,
      },
      Java: {
        fileName: "BirthdayApart.java",
        code: `void main() {
    var day = calendar.get("your birthday");
    reminders.fire(day);
    for (int hour = 0; hour < 24; hour++) {
        phone.hover("Happy birthday");
    }
    cake.cut("one slice");
    wish("that you're happy");
}`,
      },
      Swift: {
        fileName: "BirthdayApart.swift",
        code: `let day = calendar.get("your birthday")
reminders.fire(day)
for _ in 0..<24 {
    phone.hover("Happy birthday")
}
cake.cut("one slice")
wish("that you're happy")`,
      },
    },
  },
  {
    id: "heartbreak-almost",
    name: "Almost",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "almost.ts",
        code: `const steps = ["met", "fell", "stayed"];

for (const step of steps.slice(0, 2)) {
  us.add(step);
}
us.missing = steps[2];
us.label("almost");`,
      },
      Python: {
        fileName: "almost.py",
        code: `steps = ["met", "fell", "stayed"]

for step in steps[:2]:
    us.add(step)

us.missing = steps[2]
us.label("almost")`,
      },
      Rust: {
        fileName: "almost.rs",
        code: `fn main() {
    let steps = ["met", "fell", "stayed"];
    for step in &steps[..2] {
        us.add(step);
    }
    us.missing = steps[2];
    us.label("almost");
}`,
      },
      Go: {
        fileName: "almost.go",
        code: `func main() {
    steps := []string{"met", "fell", "stayed"}
    for _, step := range steps[:2] {
        us.Add(step)
    }
    us.Missing = steps[2]
    us.Label("almost")
}`,
      },
      Java: {
        fileName: "Almost.java",
        code: `void main() {
    String[] steps = {"met", "fell", "stayed"};
    for (int i = 0; i < 2; i++) {
        us.add(steps[i]);
    }
    us.missing = steps[2];
    us.label("almost");
}`,
      },
      Swift: {
        fileName: "Almost.swift",
        code: `let steps = ["met", "fell", "stayed"]

for step in steps.prefix(2) {
    us.add(step)
}
us.missing = steps[2]
us.label("almost")`,
      },
    },
  },
  {
    id: "heartbreak-wrong-timing",
    name: "Wrong Timing",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "wrongTiming.ts",
        code: `const me = life.at(2019);
const you = life.at(2024);

while (me.year !== you.year) {
  me.tick();
  you.tick();
}
meet(you);`,
      },
      Python: {
        fileName: "wrong_timing.py",
        code: `me = life.at(2019)
you = life.at(2024)

while me.year != you.year:
    me.tick()
    you.tick()

meet(you)`,
      },
      Rust: {
        fileName: "wrong_timing.rs",
        code: `fn main() {
    let mut me = life.at(2019);
    let mut you = life.at(2024);
    while me.year != you.year {
        me.tick();
        you.tick();
    }
    meet(&you);
}`,
      },
      Go: {
        fileName: "wrong_timing.go",
        code: `func main() {
    me := life.At(2019)
    you := life.At(2024)
    for me.Year != you.Year {
        me.Tick()
        you.Tick()
    }
    meet(you)
}`,
      },
      Java: {
        fileName: "WrongTiming.java",
        code: `void main() {
    var me = life.at(2019);
    var you = life.at(2024);
    while (me.year() != you.year()) {
        me.tick();
        you.tick();
    }
    meet(you);
}`,
      },
      Swift: {
        fileName: "WrongTiming.swift",
        code: `var me = life.at(2019)
var you = life.at(2024)

while me.year != you.year {
    me.tick()
    you.tick()
}
meet(you)`,
      },
    },
  },
  {
    id: "heartbreak-closure",
    name: "Closure",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "closure.ts",
        code: `let closure = you.answer("why?");
if (closure === null) {
  closure = me.forgive("both of us");
}
heart.settle(closure);
book.close(chapter(3));
book.open(chapter(4));`,
      },
      Python: {
        fileName: "closure.py",
        code: `closure = you.answer("why?")

if closure is None:
    closure = me.forgive("both of us")

heart.settle(closure)
book.close(chapter(3))
book.open(chapter(4))`,
      },
      Rust: {
        fileName: "closure.rs",
        code: `fn main() {
    let closure = match you.answer("why?") {
        Some(reason) => reason,
        None => me.forgive("both of us"),
    };
    heart.settle(closure);
    book.close(chapter(3));
    book.open(chapter(4));
}`,
      },
      Go: {
        fileName: "closure.go",
        code: `func main() {
    closure, ok := you.Answer("why?")
    if !ok {
        closure = me.Forgive("both of us")
    }
    heart.Settle(closure)
    book.Close(chapter(3))
    book.Open(chapter(4))
}`,
      },
      Java: {
        fileName: "Closure.java",
        code: `void main() {
    var closure = you.answer("why?");
    if (closure == null) {
        closure = me.forgive("both of us");
    }
    heart.settle(closure);
    book.close(chapter(3));
    book.open(chapter(4));
}`,
      },
      Swift: {
        fileName: "Closure.swift",
        code: `let closure = you.answer("why?")
    ?? me.forgive("both of us")

heart.settle(closure)

book.close(chapter(3))
book.open(chapter(4))`,
      },
    },
  },
  {
    id: "heartbreak-healing",
    name: "Healing",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "healing.ts",
        code: `const heart = pieces.gather();
for (const crack of heart.cracks) {
  crack.fill("gold");
  wait(days(7));
}
heart.beat();
console.log("stronger where it broke");`,
      },
      Python: {
        fileName: "healing.py",
        code: `heart = pieces.gather()
for crack in heart.cracks:
    crack.fill("gold")
    wait(days(7))

heart.beat()
print("stronger where it broke")`,
      },
      Rust: {
        fileName: "healing.rs",
        code: `fn main() {
    let mut heart = pieces.gather();
    for crack in heart.cracks.iter_mut() {
        crack.fill("gold");
        wait(days(7));
    }
    heart.beat();
    println!("stronger where it broke");
}`,
      },
      Go: {
        fileName: "healing.go",
        code: `func main() {
    heart := pieces.Gather()
    for _, crack := range heart.Cracks {
        crack.Fill("gold")
        wait(days(7))
    }
    heart.Beat()
    fmt.Println("stronger where it broke")
}`,
      },
      Java: {
        fileName: "Healing.java",
        code: `void main() {
    var heart = pieces.gather();
    for (var crack : heart.cracks()) {
        crack.fill("gold");
        wait(days(7));
    }
    heart.beat();
    IO.println("stronger where it broke");
}`,
      },
      Swift: {
        fileName: "Healing.swift",
        code: `let heart = pieces.gather()
for crack in heart.cracks {
    crack.fill("gold")
    wait(days(7))
}
heart.beat()
print("stronger where it broke")`,
      },
    },
  },
  {
    id: "heartbreak-ghosted",
    name: "Ghosted",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "ghosted.ts",
        code: `const sent = chat.send("still on Friday?");
let reply = null;
while (reply === null) {
  reply = chat.poll(sent);
  sleep(days(1));
}
makePlans(reply);`,
      },
      Python: {
        fileName: "ghosted.py",
        code: `sent = chat.send("still on Friday?")
reply = None
while reply is None:
    reply = chat.poll(sent)
    sleep(days(1))

make_plans(reply)`,
      },
      Rust: {
        fileName: "ghosted.rs",
        code: `fn main() {
    let sent = chat.send("still on Friday?");
    let mut reply = None;
    while reply.is_none() {
        reply = chat.poll(&sent);
        sleep(days(1));
    }
    make_plans(reply);
}`,
      },
      Go: {
        fileName: "ghosted.go",
        code: `func main() {
    sent := chat.Send("still on Friday?")
    var reply *Message
    for reply == nil {
        reply = chat.Poll(sent)
        sleep(days(1))
    }
    makePlans(reply)
}`,
      },
      Java: {
        fileName: "Ghosted.java",
        code: `void main() {
    var sent = chat.send("still on Friday?");
    Message reply = null;
    while (reply == null) {
        reply = chat.poll(sent);
        sleep(days(1));
    }
    makePlans(reply);
}`,
      },
      Swift: {
        fileName: "Ghosted.swift",
        code: `let sent = chat.send("still on Friday?")
var reply: Message? = nil
while reply == nil {
    reply = chat.poll(sent)
    sleep(days(1))
}
makePlans(reply)`,
      },
    },
  },
  {
    id: "heartbreak-still-on-read",
    name: "Still on Read",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "stillOnRead.ts",
        code: `const sent = chat.send("I miss you");
sent.waitUntil("Read");
for (let night = 1; night <= 30; night++) {
  chat.open();
  chat.stare(sent.status);
}
chat.archive();`,
      },
      Python: {
        fileName: "still_on_read.py",
        code: `sent = chat.send("I miss you")
sent.wait_until("Read")
for night in range(30):
    chat.open()
    chat.stare(sent.status)

chat.archive()`,
      },
      Rust: {
        fileName: "still_on_read.rs",
        code: `fn main() {
    let sent = chat.send("I miss you");
    sent.wait_until("Read");
    for _night in 1..=30 {
        chat.open();
        chat.stare(&sent.status);
    }
    chat.archive();
}`,
      },
      Go: {
        fileName: "still_on_read.go",
        code: `func main() {
    sent := chat.Send("I miss you")
    sent.WaitUntil("Read")
    for range 30 {
        chat.Open()
        chat.Stare(sent.Status)
    }
    chat.Archive()
}`,
      },
      Java: {
        fileName: "StillOnRead.java",
        code: `void main() {
    var sent = chat.send("I miss you");
    sent.waitUntil("Read");
    for (int night = 1; night <= 30; night++) {
        chat.open();
        chat.stare(sent.status());
    }
    chat.archive();
}`,
      },
      Swift: {
        fileName: "StillOnRead.swift",
        code: `let sent = chat.send("I miss you")
sent.waitUntil("Read")
for _ in 1...30 {
    chat.open()
    chat.stare(sent.status)
}
chat.archive()`,
      },
    },
  },
  {
    id: "heartbreak-empty-side",
    name: "Empty Side of the Bed",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "emptySide.ts",
        code: `const bed = home.bed();
let nights = 0;
while (bed.right.isEmpty()) {
  sleepOn(bed.left);
  nights++;
}
bed.right.smoothSheets();`,
      },
      Python: {
        fileName: "empty_side.py",
        code: `bed = home.bed()
nights = 0
while bed.right.is_empty():
    sleep_on(bed.left)
    nights += 1

bed.right.smooth_sheets()`,
      },
      Rust: {
        fileName: "empty_side.rs",
        code: `fn main() {
    let bed = home.bed();
    let mut nights = 0;
    while bed.right.is_empty() {
        sleep_on(&bed.left);
        nights += 1;
    }
    bed.right.smooth_sheets();
}`,
      },
      Go: {
        fileName: "empty_side.go",
        code: `func main() {
    bed := home.Bed()
    nights := 0
    for bed.Right.IsEmpty() {
        sleepOn(bed.Left)
        nights++
    }
    bed.Right.SmoothSheets()
}`,
      },
      Java: {
        fileName: "EmptySide.java",
        code: `void main() {
    var bed = home.bed();
    int nights = 0;
    while (bed.right().isEmpty()) {
        sleepOn(bed.left());
        nights++;
    }
    bed.right().smoothSheets();
}`,
      },
      Swift: {
        fileName: "EmptySide.swift",
        code: `let bed = home.bed()
var nights = 0
while bed.right.isEmpty {
    sleepOn(bed.left)
    nights += 1
}
bed.right.smoothSheets()`,
      },
    },
  },
  {
    id: "heartbreak-starting-over",
    name: "Starting Over",
    mood: "Heartbreak",
    variants: {
      TypeScript: {
        fileName: "startingOver.ts",
        code: `const boxes = ["books", "plants", "me"];
const home = new Apartment("a new city");
for (const box of boxes) {
  home.unpack(box);
}
home.door.paint("yellow");
calendar.add("today", "day one");`,
      },
      Python: {
        fileName: "starting_over.py",
        code: `boxes = ["books", "plants", "me"]
home = Apartment("a new city")

for box in boxes:
    home.unpack(box)

home.door.paint("yellow")
calendar.add("today", "day one")`,
      },
      Rust: {
        fileName: "starting_over.rs",
        code: `fn main() {
    let boxes = ["books", "plants", "me"];
    let mut home = Apartment::new("a new city");
    for b in boxes {
        home.unpack(b);
    }
    home.door.paint("yellow");
    calendar.add("today", "day one");
}`,
      },
      Go: {
        fileName: "starting_over.go",
        code: `func main() {
    boxes := []string{"books", "plants", "me"}
    home := NewApartment("a new city")
    for _, box := range boxes {
        home.Unpack(box)
    }
    home.Door.Paint("yellow")
    calendar.Add("today", "day one")
}`,
      },
      Java: {
        fileName: "StartingOver.java",
        code: `void main() {
    String[] boxes = {"books", "plants", "me"};
    var home = new Apartment("a new city");
    for (var box : boxes) {
        home.unpack(box);
    }
    home.door().paint("yellow");
    calendar.add("today", "day one");
}`,
      },
      Swift: {
        fileName: "StartingOver.swift",
        code: `let boxes = ["books", "plants", "me"]
let home = Apartment("a new city")
for box in boxes {
    home.unpack(box)
}
home.door.paint("yellow")
calendar.add("today", "day one")`,
      },
    },
  },
];
