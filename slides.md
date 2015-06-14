# Functional Programming in Industry {#title}

<h3>
    Bob Ippolito (<a href="https://twitter.com/etrepum">@etrepum</a>)<br>
    [High Tech Norway]<br>
    June 17, 2015
</h3>
<h4>
[bob.ippoli.to/fp-htn-2015]
</h4>

# Who am I?

- Self-taught programmer
- Open source contributor (Python, JS, Erlang, Haskell)
- Entrepreneur (past: Mochi Media, Pieceable)
- Angel Investor & Startup Advisor
- Current Projects: Mission Bit

# Mission Bit

<img src="images/missionbit-logo.svg" class="mission-bit-logo" />

* 501c3 non-profit in San Francisco
* Free after-school coding classes
* High school and middle school
* Taught by volunteer tech professionals
* Also: summer internships, company visits, hacker lab, etc.
* [missionbit.com]

# Imperative Programming

<blockquote>
In computer science terminologies, imperative programming is a programming paradigm that describes computation in terms of <strong>statements that change a program state</strong>.
<footer>
– <cite>[Wikipedia: Imperative Programming](http://en.wikipedia.org/wiki/Imperative Programming)</cite>
</footer>
</blockquote>

# Functional Programming

<blockquote>
In computer science, functional programming is a programming paradigm—a style of building the structure and elements of computer programs—that treats computation as the evaluation of mathematical functions and <strong>avoids changing-state and mutable data</strong>.
<footer>
– <cite>[Wikipedia: Functional Programming](http://en.wikipedia.org/wiki/Functional Programming)</cite>
</footer>
</blockquote>

# Clarifications

* The important part is the programming abstraction, of course
  every runtime computation is using mutability somewhere
* Is a *style* of programming, can be done in any language
* Often easier or more efficient to use a language
  designed for FP

# Popular Languages for FP

* Scala (JVM)
* Haskell
* Clojure (JVM)
* Erlang
* OCaml
* F# (CLR)
* Elixir (Erlang VM)

# Scala Usage

* LinkedIn
* Twitter
* Opower
* Coursera

# Haskell Usage

* Finance (JP Morgan, Standard Chartered, Barclays, …)
* Facebook
* Microsoft
* IMVU
* Janrain
* Galois

# Erlang Usage

* Telecom (Ericsson, Nokia, AT&T, …)
* Cloud (Heroku, Chef, VMWare, …)
* Advertising (AdRoll, OpenX, AdGear, AOL, …)
* Messaging (WhatsApp, TigerText, 2600hz)
* Gaming (Machine Zone, Spilgames, Wooga, …)
* Finance (Klarna, Smarkets)

# Erlang Success Stories

* Machine Zone ([2014](http://fortune.com/2014/07/16/machine-zone-funding/), ~$3B valuation, Game of War!)
* WhatsApp ([2014](http://www.bloomberg.com/news/articles/2014-10-28/facebook-s-22-billion-whatsapp-deal-buys-10-million-in-sales), $22B acquisition by Facebook)
* Tail-f ([2014](http://newsroom.cisco.com/release/1451764), $175M acquisition by Cisco)
* Cloudant ([2014](http://www-03.ibm.com/press/us/en/pressrelease/43342.wss), acquired by IBM)
* Mochi Media ([2010](http://www.wsj.com/articles/SB10001424052748704081704574653430020773954), $80M acquisition by Shanda Games)
* Heroku ([2010](http://techcrunch.com/2010/12/08/breaking-salesforce-buys-heroku-for-212-million-in-cash/), $212M acquisition by Salesforce)
* Bluetail ([2000](http://www.wsj.com/articles/SB967466988486238924), $152M acquisition by Nortel)

# Caveat Emptor

Using Erlang will probably not make you rich!<br><br>
<small>… but JavaScript probably isn't doing you any favors either ;)</small>

# Popularity Cons

* Fewer learning resources available
* Unlikely to find a fancy IDE (unless Emacs counts)
* Fewer programmers available, may be harder to hire<br>
  … but you may find better ones ([Blub Paradox](http://www.paulgraham.com/avg.html))
* Fewer open source libraries available<br>
  … but maybe you waste less time on bad ones ;)

# Technical Cons

* Garbage Collection is basically a hard requirement<br>
  … but unless you're still using C++, this is status quo
* Pure algorithms may have an extra `n` or `log n` time cost<br>
  … but there's usually a way to cheat
* Shared state (e.g. configuration) can be cumbersome<br>
  … but globals are bad practice anyway

# Pre-History

1930s-1950s
~   Lambda Calculus (Turing)
~   Combinatory Calculus (Curry & Feys)
~   LISP (McCarthy)
1960s-1970s
~   Operational (Landin) and Denotational (Strachey) semantics
~   ML (Milner)
~   Lazy FP & Graph Reduction (Turner)
1980s
~   Miranda (Turner)
~   Lazy ML (Augustsson & Johnsson)

# Abbreviated History

1987
~   Erlang experiments at Ericsson's R&D lab
~   Haskell committee formed
1990
~   Haskell 1.0
1998
~   Erlang open sourced
2004
~   Scala public release
2007
~   Clojure public release

# Why so long?

* Compiling FP style code to efficient machine code is a harder problem
  than adding layers of abstraction to how the machine
  already works.
* FP languages haven't had as many corporations pushing their adoption.

# Why now?

* The imperative languages we have are a mess.
* Particularly with regard to concurrency and parallelism.
* Even embedded devices are multi-core today.
* FP can make multi-core and distributed systems easier to build.

# Pros

* Code is more declarative; what to do, not how to do it.
* Erlang and Haskell have cheap concurrency, no more callback spaghetti.
* Erlang was designed for uptime. Introspection, resiliency and
  upgrade paths are built-in.

# Declarative

Describe the problem, not the solution.

# {#merge-sort-python .small-code}

```python
# merge_sort.py
def merge_sort(lst):
    if not lst:
        return []
    lists = [[x] for x in lst]
    while len(lists) > 1:
        lists = merge_lists(lists)
    return lists[0]

def merge_lists(lists):
    result = []
    for i in range(0, len(lists) // 2):
        result.append(merge2(lists[i*2], lists[i*2 + 1]))
    if len(lists) % 2:
        result.append(lists[-1])
    return result

def merge2(xs, ys):
    i = 0
    j = 0
    result = []
    while i < len(xs) and j < len(ys):
        x = xs[i]
        y = ys[j]
        if x > y:
            result.append(y)
            j += 1
        else:
            result.append(x)
            i += 1
    result.extend(xs[i:])
    result.extend(ys[j:])
    return result
```

# {#merge-sort-erlang}

```erlang
-module(merge_sort).
-export([merge_sort/1]).

% bottom-up merge sort
merge_sort([]) ->
    [];
merge_sort(L) ->
    iterate([[X] || X <- L]).

iterate([Xs]) ->
    Xs;
iterate(Lists) ->
    iterate(merge_lists(Lists)).

merge_lists([Xs, Ys | Rest]) ->
    [merge2(Xs, Ys) | merge_lists(Rest)];
merge_lists(Lists) ->
    Lists.

merge2(Xs=[X | _], [Y | Ys]) when X > Y ->
    [Y | merge2(Xs, Ys)];
merge2([X | Xs], Ys) ->
    [X | merge2(Xs, Ys)];
merge2([], Ys) ->
    Ys.
```

# {#merge-sort-haskell}

```haskell
module MergeSort (mergeSort) where

-- | Bottom-up merge sort.
mergeSort :: Ord a => [a] -> [a]
mergeSort = mergeAll . map (:[])
  where
    mergeAll []   = []
    mergeAll [xs] = xs
    mergeAll xss  = mergeAll (mergePairs xss)

    mergePairs (a:b:xs) =
      merge a b : mergePairs xs
    mergePairs xs = xs

    merge as@(a:as') bs@(b:bs')
      | a > b     = b : merge as bs'
      | otherwise = a : merge as' bs
    merge [] bs = bs
    merge as [] = as
```

# {#parse-tcp-erlang}

Erlang has convenient bit syntax for parsing binary data

```erlang
%% This parses a TCP packet header (IPv4)!
<< SourcePort:16, DestinationPort:16, SequenceNumber:32,
   AckNumber:32, DataOffset:4, _Reserved:4, Flags:8,
   WindowSize:16, Checksum:16, UrgentPointer:16,
   Payload/binary >> = Segment,
OptSize = (DataOffset - 5)*32,
<< Options:OptSize, Message/binary >> = Payload,
<< CWR:1, ECE:1, URG:1, ACK:1, PSH:1,
   RST:1, SYN:1, FIN:1>> = <<Flags:8>>,

%% Can now process the Message according to the
%% Options (if any) and the flags CWR, …, FIN etc.
```

# Cheap Concurrency

* Immutable data is lock-free, no deadlocks if there are no locks.
* &lt;3 KB minimum per thread (process in Erlang terminology)
* High performance IO multiplexing built-in
* Can have millions of threads, even more than one per socket

# {#cost-of-concurrency}

RAM footprint per unit of concurrency (approx)

<table id="concurrency-table">
<tr class="haskell">
<td class="num">1.3KB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>Haskell ThreadId + MVar (GHC 7.6.3, 64-bit)</span>
</td>
</tr>
<tr class="erlang">
<td class="num">2.6 KB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>Erlang process (64-bit)</span>
</td>
</tr>
<tr class="go">
<td class="num">8.0 KB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>Go goroutine</span>
</td>
</tr>
<tr class="java-min">
<td class="num">64.0 KB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>Java thread stack (minimum)</span>
</td>
</tr>
<tr class="c-min">
<td class="num">64.0 KB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>C pthread stack (minimum)</span>
</td>
</tr>
<tr class="placeholder"><td colspan="2"><hr/></td></td>
<tr class="java">
<td class="num">1 MB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>Java thread stack (default)</span>
</td>
</tr>
<tr class="c">
<td class="num">8 MB</td>
<td class="name">
<div class="bar-ctr"><div class="bar"></div></div>
<span>C pthread stack (default, 64-bit Mac OS X)</span>
</td>
</tr>
</table>
</section>

# Multi-core

* One scheduler per core, scales well to 32+ cores
* Better scalability to more cores is in-progress
* Schedulers understand IO (disk, network calls)
* No implicit synchronization

# {#scheduler}

<img src="images/scheduler.svg">

# {#parse-http}

```erlang
%% Parse HTTP headers from Socket
headers(Socket, Request, Headers) ->
    ok = inet:setopts(Socket, [{active, once}]),
    receive
        {http, _, http_eoh} ->
            %% All of the HTTP headers are parsed
            handle_request(Socket, Request, Headers);
        {http, _, {http_header, _, Name, _, Value}} ->
            headers(Socket, Request, [{Name, Value} | Headers]);
        {tcp_closed, _} ->
            exit(normal);
        _Other ->
            %% Invalid request
            exit(normal)
    after ?HEADERS_RECV_TIMEOUT ->
        exit(normal)
    end.
```

# Per-process heaps

* No sharing
* GC is per-process, and not "stop the world"!
* Process references do not prevent GC
* Explicitly hibernate idle processes for compaction

# No More Async Callbacks

* Only reason to use async is because threads are expensive
* With cheap pre-emptive threads, you can write straightforward
  and performant code without inverting the control flow
* Erlang exceptions propagate along linked processes

# {#message-passing}

<h3>RPC with a Counter process</h3>

```erlang
Counter ! {self(), {add, 1}},
receive
  {Counter, {result, N}} ->
    io:format("~p~n", [N])
end.
```

# {#message-passing-2}

<h3>RPC with a Counter process</h3>

```erlang
{result, N} = gen_server:call(
  Counter,
  {add, 1}).
```

# Resiliency

* The Erlang mantra is "let it crash", don't try and handle
  every unexpected exception
* If a process dies, all of its linked ports and processes
  also receive an exit signal
  (which will free any resources such as sockets)
* At the top of the tree, a supervisor receives this signal
  and may restart the process or group of processes
* Since processes are isolated with no shared mutable data,
  this is safe and predictable!

# {#supervisor}

<svg viewBox="0 0 1000 1000" class="full diagram">
  <line x1="430" x2="350" y1="220" y2="400" data-link="SupervisorA WorkerA"/>
  <line x1="570" x2="650" y1="220" y2="400" data-link="SupervisorA SupervisorB"/>
  <line x1="580" x2="400" y1="570" y2="700" data-link="SupervisorB WorkerB1"/>
  <line x1="650" x2="650" y1="600" y2="700" data-link="SupervisorB WorkerB2"/>
  <line x1="720" x2="900" y1="570" y2="700" data-link="SupervisorB WorkerB3"/>
  <g class="supervisor" transform="translate(500, 150)" data-name="SupervisorA">
      <circle r="100"></circle>
      <text>SupervisorA</text>
  </g>
  <g class="worker" transform="translate(350, 500)" data-name="WorkerA">
      <circle r="100"></circle>
      <text>WorkerA</text>
  </g>
  <g class="supervisor" transform="translate(650, 500)" data-name="SupervisorB">
      <circle r="100"></circle>
      <text>SupervisorB</text>
  </g>
  <g class="worker" transform="translate(400, 800)" data-name="WorkerB1">
      <circle r="100"></circle>
      <text>WorkerB1</text>
  </g>
  <g class="worker" transform="translate(650, 800)" data-name="WorkerB2">
      <circle r="100"></circle>
      <text>WorkerB2</text>
  </g>
  <g class="worker" transform="translate(900, 800)" data-name="WorkerB3">
      <circle r="100"></circle>
      <text>WorkerB3</text>
  </g>
</svg>

# Introspection

* Can get an Erlang shell any networked node
* Tracing makes it possible to investigate production internals
* Great SNMP support
* Very good libraries for monitoring/logging/etc.

# Uptime

* Upgrade services on the fly with hot code loading
* It's not possible to have a truly reliable system that runs on
  a single server, so Erlang has first class distributed support
* With a few caveats, communicating from process to process between
  separate Erlang nodes is seamless. Works with the same syntax
  and libraries!

# {#distributed-diagram}

<svg viewBox="0 0 1000 1000" class="full diagram">
  <g class="host" transform="translate(20,20)" data-host="alto">
      <rect width="460" height="900"/>
      <text x="230" y="1em">alto</text>
      <g class="node" data-node="alice@alto" transform="translate(30, 100)">
        <rect width="400" height="650"/>
        <text x="200" y="1em">alice@alto</text>
        <g class="worker" data-name="PidA" transform="translate(200,170)">
            <circle r="100"/>
            <text>PidA</text>
        </g>
        <g class="supervisor" data-name="net_kernelA" transform="translate(200,470)">
            <line x1="0" y1="100" x2="0", y2="230" class="tcp" data-link="net_kernelA epmdA"/>
            <line x1="70.71" y1="70.71" x2="300", y2="230" class="tcp phase1" data-link="net_kernelA epmdB"/>
            <line x1="100" y1="0" x2="400", y2="0" class="tcp phase2" data-link="net_kernelA net_kernelB"/>
            <circle r="100"/>
            <text>net_kernel</text>
        </g>
      </g>
      <g class="epmd" transform="translate(30, 800)">
        <rect width="400" height="60"/>
        <text x="200" y="1em">epmd</text>
      </g>
  </g>
  <g class="host" transform="translate(520,20)" data-host="onyx">
      <rect width="460" height="900"/>
      <text x="230" y="1em">onyx</text>
      <g class="node" data-node="bob@onyx" transform="translate(30, 100)">
        <rect width="400" height="650"/>
        <text x="200" y="1em">bob@onyx</text>
        <g class="worker" data-name="PidB" transform="translate(200,170)">
            <circle r="100"/>
            <text>PidB</text>
        </g>
        <g class="supervisor" data-name="net_kernelB" transform="translate(200,470)">
            <line x1="0" y1="100" x2="0", y2="230" class="tcp" data-link="net_kernelB epmdB"/>
            <circle r="100"/>
            <text>net_kernel</text>
        </g>
      </g>
      <g class="epmd" transform="translate(30, 800)">
        <rect width="400" height="60" data-name="epmdB"/>
        <text x="200" y="1em">epmd</text>
      </g>
  </g>
</svg>

# Not for Everyone

* No language is great at everything! Consider a polyglot approach
  (but don't drive yourself insane with microservices).
* Learning a new language takes patience, and you will make more mistakes
  at first.
* When you make mistakes, you should ask for help. Mailing lists, IRC,
  Twitter, Slack, StackOverflow, etc. can save your project.

# Learn More (Erlang)

* [Erlang.org](http://erlang.org)
* [Erlang-Central.org](http://erlang-central.org)
* [Erlang-Factory.com](http://erlang-factory.com)
* [LearnYouSomeErlang.com](http://LearnYouSomeErlang.com)
* [Designing for Scalability with Erlang/OTP](http://shop.oreilly.com/product/0636920024149.do)
* [Erlang Programming](http://shop.oreilly.com/product/9780596518189.do)
* [Études for Erlang](http://chimera.labs.oreilly.com/books/1234000000726)
* \#erlang on IRC (freenode)

# Learn More (Haskell)

Books
~   [Learn You a Haskell for Great Good](http://learnyouahaskell.com/)
~   [Parallel and Concurrent Programming in Haskell](http://chimera.labs.oreilly.com/books/1230000000929)
~   [Haskell Programming from First Principles](http://haskellbook.com/)
~   [Real World Haskell](http://book.realworldhaskell.org/)
Lectures
~   [Functional Systems in Haskell](http://www.scs.stanford.edu/11au-cs240h/) -
    CS240h 2011, Stanford
~   [Introduction to Haskell](http://shuklan.com/haskell/index.html) -
    CS1501 Spring 2013, UVA
~   [Introduction to Haskell](http://www.seas.upenn.edu/~cis194/) -
    CIS 194 Spring 2013, UPenn
~   [Haskell Track](http://courses.cms.caltech.edu/cs11/material/haskell/) -
    CS 11 Fall 2011, Caltech
Practice
~   [exercism.io](http://exercism.io/),
    [Talentbuddy](http://www.talentbuddy.co/),
    [HackerRank](https://www.hackerrank.com/)
~   [H-99](http://www.haskell.org/haskellwiki/H-99:_Ninety-Nine_Haskell_Problems),
    [Project Euler](http://projecteuler.net/)

# Thanks!

+-------------+---------------------------------------------+
| **Slides**  | [bob.ippoli.to/fp-htn-2015]                 |
+-------------+---------------------------------------------+
| **Source**  | [github.com/etrepum/fp-htn-2015]            |
+-------------+---------------------------------------------+
| **Email**   | bob@redivi.com                              |
+-------------+---------------------------------------------+
| **Twitter** | [&#64;etrepum](https://twitter.com/etrepum) |
+-------------+---------------------------------------------+
| **Related** | [bob.ippoli.to/intro-to-erlang-2013]<br>    |
|             | [bob.ippoli.to/why-haskell-2013]            |
+-------------+---------------------------------------------+

[bob.ippoli.to/intro-to-erlang-2013]: http://bob.ippoli.to/intro-to-erlang-2013/
[bob.ippoli.to/why-haskell-2013]: http://bob.ippoli.to/why-haskell-2013/
[bob.ippoli.to/fp-htn-2015]: http://bob.ippoli.to/fp-htn-2015/
[github.com/etrepum/fp-htn-2015]: https://github.com/etrepum/fp-htn-2015/
[missionbit.com]: http://www.missionbit.com/
[High Tech Norway]: http://hightechnorway.com/