/* Original Technology Polymath comic stories. These complement, never replace, the full lessons. */
(function(){
"use strict";
const chapters=[
{title:"What makes a machine a computer?",intro:"A journey from a simple rule to a programmable machine—and the boundary between calculation and computation.",fact:"A computer is not defined by its screen or electronics. What matters is how it represents information and follows instructions. The technical lesson below includes an interactive ALU.",panels:[
["🧮","Can you calculate this?","A rule, not a gadget","A clerk adds columns of numbers by following repeatable steps. The procedure is an algorithm, even without electricity."],
["⚙️","I can do that repeatedly!","Machines inherit rules","Gears can automate a calculation. But a machine built for one procedure is not necessarily a general-purpose computer."],
["📜","Change the instructions!","The leap to programmability","If the procedure can change without rebuilding the machine, one device can carry out many different tasks."],
["🖥️","What is inside?","The five essential roles","Input supplies information; memory stores it; the processor transforms it; control coordinates operations; output communicates results."],
["🧠","Can every problem be solved?","The limits of computation","Some problems have no general algorithmic solution. Others are solvable in principle but require impractical resources."]]},
{title:"Before electricity: the age of gears",intro:"The story of mathematical tables, mechanical calculators, and an ambitious engine that was never completed in Babbage's lifetime.",fact:"The Difference Engine was designed to tabulate polynomial values using finite differences. Babbage's proposed Analytical Engine had a store, a mill, and programmable control—ideas resembling memory, CPU, and instructions.",panels:[
["📚","These tables contain errors!","A problem worth automating","Navigators, astronomers and engineers relied on numerical tables painstakingly calculated and copied by people."],
["⚙️","Use differences, not multiplication.","The Difference Engine","Babbage proposed mechanisms that could generate mathematical tables through repeated additions."],
["🏭","What if the machine followed cards?","The Analytical Engine","A more ambitious design separated storage from calculation and envisioned sequences of operations controlled by punched cards."],
["👩‍💻","The symbols could mean more.","Ada's remarkable insight","Ada Lovelace described how the Engine might manipulate symbols according to rules, not merely produce numerical tables."],
["🧩","A design can change history.","An unfinished revolution","The full Analytical Engine was not built in Babbage's lifetime, yet its architecture anticipated programmable computing."]]},
{title:"Can we define computation?",intro:"Alan Turing asks a deceptively simple question: what can a precise sequence of steps accomplish?",fact:"A Turing machine is a mathematical model, not a practical blueprint for a laptop. It helps distinguish computable tasks from tasks no general algorithm can solve.",panels:[
["✏️","What counts as a mechanical step?","The question","Imagine a person following unambiguous rules, reading and writing one symbol at a time."],
["📏","One square, one rule.","An abstract machine","Turing modeled such a procedure with a tape, a read/write head, a state, and transition rules."],
["🔁","One machine can imitate another.","Universal computation","A universal Turing machine can interpret descriptions of other machines—a foundational idea behind general-purpose programming."],
["🚫","Will this program ever stop?","The halting problem","Turing proved there can be no algorithm that correctly decides for every possible program and input whether execution halts."],
["🧭","Possible is not the same as fast.","Computability versus complexity","Theoretical possibility is one question; how much time or memory a solution needs is another."]]},
{title:"The stored-program breakthrough",intro:"Why loading instructions into memory changed computers from specialized apparatus into flexible machines.",fact:"The stored-program concept lets executable instructions be represented in addressable memory. Several teams contributed to early implementations; the historical development cannot be reduced to one inventor.",panels:[
["🔌","Rewire it for the next job.","The old bottleneck","Early electronic machines could require substantial manual reconfiguration to change their work."],
["🗂️","What if instructions were data?","A radical simplification","Represent instructions in memory, where the machine can fetch them in sequence."],
["🔢","Fetch. Decode. Execute.","A repeating cycle","The processor reads an instruction, determines its operation, performs it, and proceeds according to control flow."],
["↪️","Jump to a different instruction.","Programs become flexible","Branches and loops let a stored program react to conditions and repeat work."],
["🌍","One machine, countless uses.","General-purpose computing","The same hardware can run different programs simply by loading different instructions."]]},
{title:"Tiny switches, enormous change",intro:"From fragile vacuum tubes to transistors and integrated circuits, computing shrinks and scales.",fact:"Transistors can act as switches and amplifiers. Integrated circuits put many components onto one semiconductor substrate. Performance and power efficiency depend on far more than transistor count alone.",panels:[
["💡","This tube is hot!","Vacuum-tube computers","Early electronic computers used large numbers of vacuum tubes, consuming substantial power and requiring careful maintenance."],
["🔬","A solid-state alternative.","The transistor","The transistor enabled smaller, more reliable switching and amplification in electronic circuits."],
["🧱","Can we build them together?","Integrated circuits","Fabricating multiple components on one chip transformed manufacturing, density and cost."],
["📈","More devices, more possibilities.","Scaling changes design","As transistor density increased, designers could build more capable processors, memories and accelerators."],
["🌡️","But power still matters.","The modern constraint","Heat, energy, memory movement and parallelism increasingly shape real computer performance."]]},
{title:"Connect the milestones",intro:"Put the ideas in order and see how theory, architecture, and manufacturing influenced one another.",fact:"History is not a single straight line. Mechanical automation, formal computation, electronic engineering and software practice developed through overlapping contributions.",panels:[
["⚙️","Automate arithmetic.","Mechanical foundations","Difference engines and other calculating devices made repeated numerical operations tangible."],
["🧠","Formalize the procedure.","Theoretical foundations","Mathematical models helped clarify what it means to compute and where the limits lie."],
["🗃️","Store the program.","Architectural foundations","Putting instructions in memory made electronic computers more adaptable."],
["🔬","Miniaturize the circuit.","Hardware foundations","Transistors and integrated circuits made computation smaller, cheaper and more scalable."],
["🕸️","Everything connects.","Your timeline challenge","Build a timeline that includes not only dates but the problem each milestone solved."]]},
{title:"The computing history detective",intro:"Review the first week by tracing one modern machine back through the ideas that made it possible.",fact:"A modern GPU cluster depends on mathematical algorithms, programmable processors, semiconductor circuits, memory systems, software and networks. The story is cumulative, not a sequence of isolated inventions.",panels:[
["🔍","Who solved which problem?","Separate the contributions","Distinguish Babbage's designs, Lovelace's observations, Turing's formal model and the development of stored-program machines."],
["🧮","Calculation or computation?","Test the vocabulary","Explain why a fixed calculator and a general-purpose programmable computer are not identical."],
["🧠","Could an algorithm always decide?","Recognize fundamental limits","Describe why the halting problem cannot be solved by a universal decision procedure."],
["🖥️","How does a program run?","Connect theory to architecture","Trace an instruction from memory to the processor, then explain what makes branching possible."],
["🚀","Why does this matter for HPC?","Bring the story forward","Relate parallel processors and AI accelerators to the historical push for faster, more flexible computation."]]}
];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function render(n){
 const chapter=chapters[n];if(!chapter)return;
 const article=document.querySelector("#content article");if(!article)return;
 const block=document.createElement("section");block.className="comic-shell";block.id="illustrated-story";
 block.innerHTML='<div class="comic-mast"><div class="comic-kicker">Technology Polymath · Illustrated Origins · Episode '+String(n+1).padStart(2,"0")+'</div><h2>'+escape(chapter.title)+'</h2><p>'+escape(chapter.intro)+'</p><div class="comic-actions"><button type="button" id="comic-toggle" aria-expanded="true">Hide comic panels</button><button type="button" class="secondary" id="comic-deep">Jump to technical lesson ↓</button></div></div><div class="comic-section-label">The story · '+chapter.panels.length+' scenes</div><div class="comic-grid">'+chapter.panels.map((p,i)=>'<div class="comic-panel'+(i===4?" wide":"")+'"><div class="comic-scene"><span class="comic-n">'+(i+1)+'</span><span class="comic-illustration" aria-hidden="true">'+p[0]+'</span><span class="comic-bubble">'+escape(p[1])+'</span></div><div class="comic-caption"><strong>'+escape(p[2])+'</strong><p>'+escape(p[3])+'</p></div></div>').join("")+'</div><div class="comic-fact"><strong>🧠 What to remember</strong>'+escape(chapter.fact)+'</div><div class="comic-section-label" id="comic-technical">Explore the full interactive lesson ↓</div>';
 article.prepend(block);
 block.querySelector("#comic-toggle").onclick=()=>{const hidden=block.classList.toggle("comic-collapsed");block.querySelector("#comic-toggle").textContent=hidden?"Show comic panels":"Hide comic panels";block.querySelector("#comic-toggle").setAttribute("aria-expanded",String(!hidden))};
 block.querySelector("#comic-deep").onclick=()=>{const next=block.nextElementSibling;if(next)next.scrollIntoView({behavior:"smooth",block:"start"});};
}
const original=window.openDay;
if(typeof original==="function"){window.openDay=function(n){original(n);if(n>=0&&n<7)render(n)};}
})();
